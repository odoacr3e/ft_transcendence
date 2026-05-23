
const lib = require("../lib/lib.js");
const prisma = lib.conn.prisma;

const getAllNotifications = async () => {
	return await prisma.notifications.findMany({
	});
}

const getNotify = { getAllNotifications };

module.exports = { getNotify };