
import * as lib from "../lib/lib.js";
import * as usersUtils from "./users.js"
import * as usersQuery from "../query/usersQuery.js"
import jwt from "jsonwebtoken";
import ms from "ms";
import { jsonResponse } from "../utils/response.js";
const { redis } = lib.conn;
const { crypto } = lib.conn;

/**
 * Jwt format
 * // 1. Payload - dati che vuoi salvare nel token (dati che risultino univoci)
 * // 2. Chiave segreta - presa dal .env
 * // 3. Opzioni
 * { id: x, username: y }, 
 * { JWT_SECRET },
 * { expiresIn: "h/d/y" }
 */

// check jwt valido, altrimenti ritorno "token invalido"
// se token scaduto -> sotto /refresh genero altro token di rinnovo + token jwt e invalido quello precedente
const checkJwt = async (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1];
	if (!token)
		return res.status(401).json(jsonResponse.ResponseError("User not autorized"));
	try {
		req.user = jwt.verify(token, process.env.JWT_SECRET);
		next();
	} catch (error){
		if (error.name == "TokenExpiredError")
			return res.status(401).json(jsonResponse.ResponseError("Token expired"));
		return res.status(403).json(jsonResponse.ResponseError("Invalid token"));
	}
};

/**
 * @description async funztion, creazione JWT per login/registrazione utente
 * @param {{ id_user: number, name: string, surname: string, username: string, email: string, nationality: string }} user
 */
const createJwt = async (req, res) => {
	const token = jwt.sign(
		{ id_user: req.user.id_user, username: req.user.username },
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_TTL }
	);
	const ttl = ms(process.env.REFRESH_TTL) / 1000;
	const refreshToken = crypto.randomUUID();
	await redis.set(
		`refresh:${refreshToken}`,
		JSON.stringify({
			"userId": req.user.id_user,
			"used": false
		}),
		'EX', ttl
	);
	return ({"jwt": token, "refresh": refreshToken});
}

/** 
 * @typedef {{ "userId": Number, "used": Boolean }} token 
*/

async function revokeTokenSessions(userId) {
	const keys = await redis.keys('refresh:*');
	for (const key of keys)
	{
		const val = await redis.get(key);
		if (!val)
			continue ;
		/** @type {token} data */
		const data = JSON.parse(val);
		if (data.userId == userId)
			await redis.del(key)
	}
}

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
 * @param {String} username 
 * @param {String} email 
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

export { createJwt, checkJwt, revokeTokenSessions, validateInputRegister, validateUser };
