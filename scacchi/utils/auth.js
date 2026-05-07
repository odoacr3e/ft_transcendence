
const lib = require("../lib/lib.js");
const jwt = require("jsonwebtoken");


/**
 * Jwt format
 * // 1. Payload - dati che vuoi salvare nel token (dati che risultino univoci)
 * // 2. Chiave segreta - presa dal .env
 * // 3. Opzioni
 * { id: x, username: y }, 
 * { JWT_SECRET },
 * { expiresIn: "h/d/y" }
 */

const checkJwt = async (req, res) => {
	console.log(req.user);
	console.log("User " + req.user.username + " trovato");
	return res.status(200).json({ log: "Loggato" });
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const createJwt = async (req, res) => {
	const token = jwt.sign(
		{ id_user: req.user.id_user, username: req.user.username },
		process.env.JWT_SECRET,
		{ expiresIn: "1d" }
	);
	console.log("User loggato");
	res.status(200).json({user: req.user, token: token});
}

module.exports = { createJwt, checkJwt };
