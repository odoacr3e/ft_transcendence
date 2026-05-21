
const lib = require("../../lib/lib.js");
const bcrypt = require("bcryptjs");
const { prisma } = require("../../lib/prisma.js");
const { createJwt, checkJwt } = require("../../utils/auth.js");
const { jsonResponse } = require("../../utils/response.js");
const usersQuery = require("../../query/usersQuery.js");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const checkLogin = async (req, res) => {
	try {
		const { username, password } = req.body;
		if (!username || !password)
			return (res.status(400).json(jsonResponse.ResponseError("Missing credentials")));
		const user = await prisma.users.findUnique({
			select: {
				id_user: true,
				name: true,
				surname: true,
				username: true,
				password: true,
				email: true,
				image: true,
				nationality: true,
				points: true,
				title: true,
				preferences: {
					select: {
						name: true,
						description: true,
						colors: true
					}
				}
			},
			where: {
				username: String(username)
			}
		});
		if (!user || !(await bcrypt.compare(password, user.password)))
			return res.status(401).json(jsonResponse.ResponseError("Credenziali non valide"));
		delete(user.password);
		req.user = user; // aggiungo lo user trovato all'oggetto request per averlo anche nel successivo middleware
		const token = await createJwt(req, res);
		// token.jwt = "abcd";
		// if (checkJwt(req))
		return res.status(200).json(jsonResponse.ResponseSuccess({ "user": user, "token": token }));
	} catch (error) {
		console.log("Server error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error checking for user"));
	}
};


module.exports = { checkLogin };