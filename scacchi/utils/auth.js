
const lib = require("../lib.js");
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
	res.status(200).json({ log: "Loggato" });
};

/**
 * @param {{ id_user: number, name: string, surname: string, username: string, email: string, nationality: string }} user
 */
const createJwt = async (user) => {
	const token = jwt.sign(
		{ id_user: user.id_user, username: user.username },
		process.env.JWT_SECRET,
		{ expiresIn: "1d" }
	);
	return (token);
}

module.exports = { createJwt, checkJwt };
