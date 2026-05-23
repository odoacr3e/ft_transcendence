
const lib = require("../lib/lib.js");
const prisma = lib.conn.prisma;
const { jsonResponse } = require("../utils/response.js");
const { getNotify } = require("../query/notifiyQuery.js");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getAllNotifications = async (req, res) => {
	try {
		// console.log("Req.query: ", req.query.title);
		const { title, id_user, id_sender, status, creation_date } = req.query;
		let not;
		const filter = {};
		for (const [key, value] of Object.entries(req.query))
		{
			console.log("Key", key);
		}
		return res.status(200).json({"gay": true});
	} catch (error) {
		return res.status(500).json(jsonResponse.ResponseError("Server error finding notifications"));
	}
}



module.exports = { getAllNotifications };
