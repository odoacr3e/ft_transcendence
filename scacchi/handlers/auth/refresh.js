
const lib = require("../../lib/lib.js");
const { redis } = lib.conn.redis;
const { crypto } = lib.conn.crypto;
const { createJwt } = require("../../utils/auth.js");
const { colors } = require("../../utils/colors.js");
const { jsonResponse } = require("../../utils/response.js");

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
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const refresh = async (req, res) => {
	const { refreshToken } = req.body;
	const token = await redis.get(`refresh:${refreshToken}`);
	if (!token)
		return res.status(403).json(jsonResponse.ResponseError("Invalid or expired token"));
	/** @type {token} raw */
	const raw = JSON.parse(token);
	if (raw.used == true)
	{
		revokeTokenSessions(raw.userId)
		return res.status(403).json(jsonResponse.ResponseError("Token already used"));
	}
	const newRefresh = crypto.randomUUID();
	await redis.set(
		`refresh:${newRefresh}`,
		JSON.stringify({
			"userId": req.user.id_user,
			"used": false
		}),
		'EX', 60 * 60 * 24 * 7 // 7 giorni in secondi
	);
	const token = jwt.sign(
		{ id_user: req.user.id_user, username: req.user.username },
		process.env.JWT_SECRET,
		{ expiresIn: "1m" }
	);
}

module.exports = { refresh };