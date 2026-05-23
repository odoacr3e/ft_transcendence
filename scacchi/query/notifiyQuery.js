
const lib = require("../lib/lib.js");
const prisma = lib.conn.prisma;

const getAllNotifications = async () => {
	return await prisma.notifications.findMany({
		select: {
			id_notification: true,
			title: true,
			description: true,
			status: true,
			id_user: true,
			creation_date: true,
			users_notifications_id_senderTousers: {
				select: {
					id_user: true,
					username: true
				}
			}
		}
	});
}

const getFilteredNotifications = async (filter) => {
	return await prisma.notifications.findMany({
		where: filter,
		select: {
			id_notification: true,
			title: true,
			description: true,
			status: true,
			id_user: true,
			creation_date: true,
			users_notifications_id_senderTousers: {
				select: {
					id_user: true,
					username: true
				}
			}
		}
	});
}

const getNotificationById = async (id) => {
	return await prisma.notifications.findUnique({
		select: {
			id_notification: true,
			title: true,
			description: true,
			status: true,
			id_user: true,
			creation_date: true,
			users_notifications_id_senderTousers: {
				select: {
					id_user: true,
					username: true
				}
			}
		},
		where: {id_notification: Number(id)}
	});
}

const getNotify = { getAllNotifications, getFilteredNotifications, getNotificationById };

module.exports = { getNotify };