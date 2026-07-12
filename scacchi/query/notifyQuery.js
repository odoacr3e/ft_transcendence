
import { prisma } from "../lib/prisma.js";

export async function getAllNotifications (id) {
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
		},
		where: { id_user: id },
		orderBy: {
			id_notification: 'desc'
		}
	});
}

export async function getFilteredNotifications (filter) {
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

export async function getNotificationById (id_user, id_notification) {
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
export async function postNotification (data) {
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

/**
 * 
 * @param {Array} ids 
 */
export async function readNotifications (ids) {
	return await prisma.notifications.updateMany({
		data: {
			status: 'read'
		},
		where: {
			id_notification: { in: ids }
		}
	});
}
