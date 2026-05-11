
const lib = require("../lib/lib.js");
const bcrypt = require("bcryptjs");
const { prisma } = require("../lib/prisma.js")
const { error } = require("node:console");
const { createJwt } = require("../utils/auth.js");
const usersUtils = require("../utils/users");
const { colors } = require("../utils/colors");

/** 
 * autenticazione tramite middleware
 * -> per router.post("/", middle1, middle2, middleX ...)
 * -> ogni middleware fa da strato di controllo e ha questa forma di dichiarazione (req, res, next) =>
 * -> per passare al controllo (funzione) successivo va chiamato next() -> significa che il controllo è stato superato,
 * altrimenti viene data una risposta al client di errore
 * 
 * 1. controllo che username e password siano presenti -> checkCredentials
 * 2. controllo che lo user esista nel db e che le credenziali siano giuste -> checkUser
 * 3. generazione token JWT
*/

// ANCHOR: login functions

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const checkCredentials = (req, res, next) => {
	const { username, password } = req.body;
	if (!username || !password)
		return (res.status(400).json({ error: "Credenziali mancanti" }));
	next();
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const checkUser = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await prisma.users.findUnique({ where: { username: String(username) } }); // da espandere campi richiesti
		if (!user || !(await bcrypt.compare(password, user.password)))
			return res.status(401).json({ error: "Credenziali non valide" });
		console.log("User " + user.username + " trovato");
		delete(user.password);
		req.user = user; // aggiungo lo user trovato all'oggetto request per averlo anche nel successivo middleware
		const token = await createJwt(req, res);
		return res.status(201).json({ "user": user, "token": token });
	} catch (error) {
		return res.status(500).json({ error: "Server error checking user" });
	}
};

//ANCHOR: create user function

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const validateInput = async (req, res, next) => {
	/** @type {{ username: string, password: string, email: string }} */
	const { username, email, password } = req.body;
	// console.log(`username: ${colors.yellow}${username}${colors.reset}, email: ${colors.yellow}${email}${colors.reset}, password: ${colors.yellow}${password}${colors.reset}`);
	if (!username || username.length < 4)
		return res.status(400).json({ error: "Username too short" });
	if (!usersUtils.checkEmail(email))
		return res.status(400).json({ error: "Invalid email format" });
	if (!usersUtils.checkPassword(password))
		return res.status(400).json({ error: "Invalid password format" });
	console.log(`Validate input: ${colors.green}OK${colors.reset}`);
	next();
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const validateUser = async (req, res, next) => {
	try {
		const { username, email } = req.body;
		const user = await prisma.users.findFirst({
			where: {
				OR: [
					{ username: username },
					{ email: email }
				]
			}
		});
		if (user)
			return res.status(409).json({ error: "User already exists" });
		console.log(`Validate User: ${colors.green}OK${colors.reset}`);
		next();
	} catch (error) {
		return res.status(500).json({ error: "Server error creating user" });
	}
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const createUser = async (req, res) => {
	try {
		const { name, surname, username, email, password, nationality } = req.body;
		const hashedPwd = await bcrypt.hash(password, parseInt(lib.Macro.HASH_SALT));
		const user = await prisma.users.create({
			data: {
				name: name,
				surname: surname,
				username: username,
				email: email,
				password: hashedPwd,
				nationality: nationality
			},
			select: {
				id_user: true,
				name: true,
				surname: true,
				username: true,
				email: true,
				image: true,
				nationality: true,
				points: true,
				title: true,
				preferences: {
					select: {
						name: true,
						description: true,
						colors: true,
					}
				}
			}
		});
		if (!user)
			return res.status(500).json({ error: "Server error creating user 1" });
		req.user = user;
		const token = await createJwt(req, res);
		return res.status(201).json({ "user": user, "token": token });
	} catch (error) {
		return res.status(500).json({ error: "Server error creating user 2" });
	}
}

const createUserHandler = { validateInput, validateUser, createUser };
const loginUserHandler = { checkCredentials, checkUser };

module.exports = { loginUserHandler, createUserHandler };
