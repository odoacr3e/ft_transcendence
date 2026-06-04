
import * as lib from "../lib/lib.js";
import { jsonResponse } from "../utils/response.js";
import { getNotify } from "../query/notifiyQuery.js";
import { checkJwt } from "../utils/auth.js";
const { prisma } = lib.conn.prisma;
export const notifyRouter = lib.include.express.Router();

/**
 * @param {import('express').Request} req
 */
function checkQueryParams(req) {
	const filter = {};
	const { id_user } = req.user;
	filter.id_user = id_user;
	/** @type {String} key */
	for (const [key, value] of Object.entries(req.query))
	{
		if (key === 'title')
			filter[key] = {contains: String(value), mode: 'insensitive'};
		else if (key === 'start_date')
			filter['creation_date'] = {...filter['creation_date'], gte: new Date(String(value))};
		else if (key === 'end_date')
			filter['creation_date'] = {...filter['creation_date'], lte: new Date(String(value))};
		else if (key === 'username')
			filter['users_notifications_id_senderTousers'] = {username: {contains: String(value), mode: 'insensitive'}};
		else
			filter[key] = value;
	}
	return (filter);
}

// NOTE: /api/notifications
notifyRouter.get("/", checkJwt, async (req, res) => {
	try {
		const filter = checkQueryParams(req);
		const notif = Object.keys(filter).length > 0 ? await getNotify.getFilteredNotifications(filter) : await getNotify.getAllNotifications();
		if (notif && notif.length > 0)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "notifications": notif }));
		return res.status(404).json(jsonResponse.ResponseError("Notifications not found"));
	} catch (error) {
		console.log("error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error retrieving notifications"));
	}
});

notifyRouter.get("/:id", async (req, res) => {
	try {
		const notif = await getNotify.getNotificationById(req.params.id);
		if (notif)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "notification": notif }));
		return res.status(404).json(jsonResponse.ResponseError("Notification not found"));
	} catch (error) {
		console.log("error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error retrieving notifications by id"));
	}
});

notifyRouter.post("/", checkJwt, async (req, res) => {
	try {
		const { id_user } = req.user;
		
	} catch (error) {
		
	}
});