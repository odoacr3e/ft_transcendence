
import * as lib from "../lib/lib.js";
import * as usersQuery from "../query/usersQuery.js";
import bcrypt from "bcryptjs";
import { createJwt, checkJwt, revokeTokenSessions, 
	validateInputRegister, validateUser, cookiesOpt } from "../utils/auth.js";
import { jsonResponse } from "../utils/response.js";
import { colors } from "../utils/colors.js";
import { log } from "../utils/log.js";
import { sendEmail } from "../lib/emailSender.js";
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
			// printLog(`User ${user.username} failed to login`, 'warn');
			return res.status(401).json(jsonResponse.ResponseError("Invalid credentials"));
		}
		delete(user.password);
		req.user = user;
		console.log(`User ${req.user.username} correctly logged in`, 'ok')
		await createJwt(req, res);
		return res.status(200).json(jsonResponse.ResponseSuccess({ "user": user }));
	} catch (error) {
		console.log("Error: ", error);
		// printLog(`User couldn't complete login due server error: ${error.name}`, 'error');
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
		// await sendEmail({
		// 	to: user.email,
		// 	subject: "Nuovo account creato",
		// 	body: `<h2>Ciao ${user.username}!</h2><p>Il tuo acoount e' stato creato</p>`
		// })
		req.user = user;
		await createJwt(req, res);
		// printLog(`New user created with username ${user.username}`, colors.brightGreen)
		return res.status(201).json(jsonResponse.ResponseSuccess({ "user": user }));
	} catch (error) {
		console.log("Error: ", error);
		// printLog(`User couldn't correctly register due server error: ${error.name}`, colors.brightYellow);
		return res.status(500).json(jsonResponse.ResponseError("Server error creating user"));
	}
});

// NOTE: da controllare se mandare user come parametro finale o se recuperare solo id dal refresh token
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
authRouter.post("/refresh", async (req, res) => {
	try {
		const { refresh_token } = req.cookies;
		const { user } = req.body;
		const refToken = await redis.get(`refresh:${refresh}`);
		if (!refToken)
			return res.status(403).json(jsonResponse.ResponseError("Invalid or expired token"));
		/** @type {token} rawToken */
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
		await createJwt(req, res);
		await redis.del(`refresh:${refresh}`);
		return res.status(200).json(jsonResponse.ResponseSuccess({ "user": user }));
	} catch (error) {
		// printLog(`User couldn't refresh token due server error: ${error.name}`, colors.brightYellow);
		return res.status(403).json(jsonResponse.ResponseError("Server error refreshing token"));
	}
});

authRouter.post("/logout", checkJwt, async (req, res) => {
	try {
		const refreshToken = req.cookies.refresh_token;
		const jwtToken = req.cookies.jwt_token;
		const { id_user } = req.user;
		await redis.del(`refresh:${id_user}`);
		const now = Math.floor(Date.now() / 1000); // metto in blacklist il jwt per il tempo di vita residua
		const ttlJwt = req.user.exp - now;
		if (ttlJwt > 0)
			await redis.set(`blacklist:${jwtToken}`, '1', 'EX', ttlJwt);
		res.clearCookie('jwt_token', cookiesOpt);
		res.clearCookie('refresh_token', { ...cookiesOpt, path: '/auth/refresh'});
		return res.status(200).json(jsonResponse.ResponseSuccess({ logout: "ok" }));
	} catch (error) {
		console.log("Error: ", error);
		// printLog(`User couldn't logout due server error: ${error.name}`, colors.brightYellow);
		return res.status(403).json(jsonResponse.ResponseError("Server error logging out user"));
	}
});