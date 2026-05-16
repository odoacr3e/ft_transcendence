
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
 * 
 * @param {String} username 
 * @param {String} email 
 * @param {String} password 
 * @returns {String}
 */

const validateInputRegister = (username, email, password) => {
	if (!username || username.length < 4)
		return ("Username too short");
	if (!email || !usersUtils.checkEmail(email))
		return ("Invalid email format");
	if (!password || !usersUtils.checkPassword(password))
		return ("Invalid password format");
	return ("OK");
}

/**
 * 
 * @returns 
 */
const validateUser = async (username, email) => {
	const userEmail = await usersQuery.getUserByEmail
	const user = await prisma.users.findFirst({
		where: {
			OR: [
				{ username: username },
				{ email: email }
			]
		}
	});
	if (user)
		return (false);
	return (true);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const createUser = async (req, res) => {
	try {
		const { name, surname, username, email, password, nationality } = req.body;
		const inputs = validateInputRegister(username, email, password);
		if (inputs != "OK")
			return res.status(400).json(jsonResponse.ResponseError(inputs));
		if (!(await validateUser(username, email)))
			return res.status(409).json(jsonResponse.ResponseError("User already exists"));
		const hashedPwd = await bcrypt.hash(password, parseInt(lib.Macro.HASH_SALT));
		const user = await usersQuery.createUser(name, surname, username, hashedPwd, email, nationality);
		if (!user)
			return res.status(500).json(jsonResponse.ResponseError("Server error creating user"));
		req.user = user;
		const token = await createJwt(req, res);
		return res.status(201).json(jsonResponse.ResponseSuccess({ "user": user, "token": token }));
	} catch (error) {
		console.log("Error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error creating user"));
	}
}

module.exports = { createUser };
