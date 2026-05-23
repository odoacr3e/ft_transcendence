
const lib = require("../lib/lib.js");
const prisma = lib.conn.prisma;

const getAllNotifications = async () => {
	return await prisma.notifications.findMany({
	});
}

const getFilteredNotifications = async (filter) => {
	return await prisma.notifications.findMany({
		where: filter
	});
}

const getNotify = { getAllNotifications, getFilteredNotifications };

module.exports = { getNotify };