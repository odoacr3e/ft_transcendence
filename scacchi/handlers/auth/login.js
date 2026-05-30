
import * as lib from "../../lib/lib.js";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { createJwt, checkJwt } from "../../utils/auth.js";
import { jsonResponse } from "../../utils/response.js";
import * as usersQuery from "../../query/usersQuery.js";

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
		return res.status(200).json(jsonResponse.ResponseSuccess({ "user": user, "token": token }));
	} catch (error) {
		console.log("Server error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error checking for user"));
	}
};


export { checkLogin };