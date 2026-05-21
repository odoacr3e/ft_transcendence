
const lib = require("../lib/lib.js");
const jwt = require("jsonwebtoken");
const { jsonResponse } = require("../utils/response.js");
const redis = lib.conn.redis;
const crypto = lib.conn.crypto;

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
// se token scaduto -> sotto /refresh genero altro token di rinnovo + token jwt e invalida quello precedente
const checkJwt = async (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1];
	if (!token)
		return res.status(401).json(jsonResponse.ResponseError("User not autorized"));
	try {
		req.utente = jwt.verify(token, process.env.JWT_SECRET);
		console.log("JWT: ", req.utente);
		next();
	} catch (error){
		console.log("Error: ", error);
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
	// console.log("User createJwt:", req.user);
	const token = jwt.sign(
		{ id_user: req.user.id_user, username: req.user.username },
		process.env.JWT_SECRET,
		{ expiresIn: "1m" }
	);
	const refreshToken = crypto.randomUUID();
	await redis.set(
		`refresh:${refreshToken}`,
		JSON.stringify({
			"userId": req.user.id_user,
			"used": false
		}),
		'EX', 60 * 60 * 24 * 7 // 7 giorni in secondi
	);
	return ({"jwt": token, "refresh": refreshToken});
}

module.exports = { createJwt, checkJwt };
