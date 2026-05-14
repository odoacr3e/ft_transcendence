
const lib = require("../../lib/lib.js");
const bcrypt = require("bcryptjs");
const { prisma } = require("../../lib/prisma.js");
const { createJwt } = require("../../utils/auth.js");
const usersUtils = require("../../utils/users.js");
const { colors } = require("../../utils/colors.js");
const { jsonResponse } = require("../../utils/response.js");
const usersQuery = require("../../query/usersQuery.js");

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

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const validateInput = async (req, res, next) => {
	/** @type {{ username: string, password: string, email: string }} */
	const { username, email, password } = req.body;
	// console.log(`username: ${colors.yellow}${username}${colors.reset}, email: ${colors.yellow}${email}${colors.reset}, password: ${colors.yellow}${password}${colors.reset}`);
	if (!username || username.length < 4)
		return res.status(400).json(jsonResponse.jsonErrorResponse("Username too short"));
	if (!usersUtils.checkEmail(email))
		return res.status(400).json(jsonResponse.jsonErrorResponse("Invalid email format"));
	if (!usersUtils.checkPassword(password))
		return res.status(400).json(jsonResponse.jsonErrorResponse("Invalid password format"));
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
			return res.status(409).json(jsonResponse.jsonErrorResponse("User already exists"));
		next();
	} catch (error) {
		return res.status(500).json(jsonResponse.jsonErrorResponse("Server error creating user"));
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
		const user = await usersQuery.createUser(name, surname, username, hashedPwd, email, nationality);
		if (!user)
			return res.status(500).json(jsonResponse.jsonErrorResponse("Server error creating user"));
		req.user = user;
		const token = await createJwt(req, res);
		return res.status(201).json(jsonResponse.jsonSuccessResponse({ "user": user, "token": token }));
	} catch (error) {
		return res.status(500).json(jsonResponse.jsonErrorResponse("Server error creating user"));
	}
}

const createUserHandler = { validateInput, validateUser, createUser };

module.exports = { createUserHandler };
