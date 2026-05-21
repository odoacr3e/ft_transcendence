
const lib = require("../../lib/lib.js");
const redis = lib.conn.redis;
const crypto = lib.conn.crypto;
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
const refreshToken = async (req, res) => {
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
}

module.exports = { refreshToken };