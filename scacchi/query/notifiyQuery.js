
import * as lib from "../lib/lib.js";
const { prisma } = lib.conn;

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

/**
 * @param {{ id_sender: Number, id_receiver: Number, title: String,
 * description: String, creation_date: Date }} data
 */
const postNotification = async (data) => {
	return await prisma.notifications.create({
		data: data,
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

const getNotify = { getAllNotifications, getFilteredNotifications, getNotificationById };
const postNotify = { postNotification };

export { getNotify , postNotify};