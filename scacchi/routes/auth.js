
import * as lib from "../lib/lib.js";
import * as usersQuery from "../query/usersQuery.js";
import bcrypt from "bcryptjs";
import { createJwt, revokeTokenSessions, 
	validateInputRegister, validateUser } from "../utils/auth.js";
import { jsonResponse } from "../utils/response.js";
import { colors } from "../utils/colors.js";
import { printLog } from "../utils/log.js";
const { fs, logfd } = lib.include;
const { prisma } = lib.conn;
const { redis } = lib.conn;
const { crypto } = lib.conn;
export const authRouter = lib.include.express.Router();

// NOTE: route /auth

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
authRouter.post("/login", async (req, res) => {
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
		{
			printLog(`User ${user.username} failed to login`, colors.brightRed);
			return res.status(401).json(jsonResponse.ResponseError("Credenziali non valide"));
		}
		delete(user.password);
		req.user = user; // aggiungo lo user trovato all'oggetto request per averlo anche nel successivo middleware
		const token = await createJwt(req, res);
		printLog(`User ${user.username} correctly logged in`, colors.brightGreen)
		return res.status(200).json(jsonResponse.ResponseSuccess({ "user": user, "token": token }));
	} catch (error) {
		console.log("Server error: ", error);
		printLog(`User ${user.username} couldn't complete login due server error`, colors.brightYellow);
		return res.status(500).json(jsonResponse.ResponseError("Server error checking for user"));
	}
});



/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
authRouter.post("/register", async (req, res) => {
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
});

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
authRouter.post("/refresh", async (req, res) => {
	try {
		const { refresh, user } = req.body;
		const refToken = await redis.get(`refresh:${refresh}`);
		if (!refToken)
			return res.status(403).json(jsonResponse.ResponseError("Invalid or expired token"));
		/** @type {token} raw */
		const rawToken = JSON.parse(refToken);
		if (rawToken.used == true)
		{
			revokeTokenSessions(rawToken.userId)
			return res.status(403).json(jsonResponse.ResponseError("Token already used"));
		}
		req.user = user;
		await redis.set(
			`refresh:${refresh}`,
			JSON.stringify({ ...rawToken, used: true }),
			'KEEPTTL'
		);
		const token = await createJwt(req, res);
		await redis.del(`refresh:${refresh}`);
		return res.status(200).json(jsonResponse.ResponseSuccess({ "user": user, "token": token }));
	} catch (error) {
		console.log("Error: ", error);
		return res.status(403).json(jsonResponse.ResponseError("Server error refreshing token"));
	}
});

