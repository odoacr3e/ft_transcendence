
const lib = require("../lib/lib.js");
const prisma = lib.conn.prisma;
const { jsonResponse } = require("../utils/response.js");
const { getNotify } = require("../query/notifiyQuery.js");

/**
 * @param {import('express').Request} req
 */
function checkQueryParams(req) {
	const filter = {};
	/** @type {String} key */
	for (const [key, value] of Object.entries(req.query))
	{
		if (key === 'title')
			filter[key] = {contains: String(value), mode: 'insensitive'};
		else if (key === 'start_date')
			filter['creation_date'] = {...filter['creation_date'], gte: new Date(String(value))};
		else if (key === 'end_date')
			filter['creation_date'] = {...filter['creation_date'], lte: new Date(String(value))};
		else if (key.includes('id'))
			filter[key] = Number(value);
		else
			filter[key] = value;
	}
	console.log(filter)
	return (filter);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getAllNotifications = async (req, res) => {
	try {
		let notif;
		const filter = checkQueryParams(req);		
		if (Object.keys(filter).length > 0)
			notif = await getNotify.getFilteredNotifications(filter);
		else
			notif = await getNotify.getAllNotifications();
		if (notif && notif.length > 0)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "notifications": notif }));
		return res.status(404).json(jsonResponse.ResponseError("Notifications not found"));
	} catch (error) {
		console.log("error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error finding notifications"));
	}
}



module.exports = { getAllNotifications };
