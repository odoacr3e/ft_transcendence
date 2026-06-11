
import { diff } from "node:util";
import * as lib from "../lib/lib.js";
const { prisma } = lib.conn;

const getAllUserFriendships = async (id_user) => {
	const friendList = await prisma.friendships.findMany({
		select: {
			users_friendships_id_user1Tousers: {
				select: {
					id_user: true,
					username: true
				}
			},
			users_friendships_id_user2Tousers: {
				select: {
					id_user: true,
					username: true
				}
			},
			friend_status: true
		},
		where: {
			OR: [
				{ id_user1: id_user },
				{ id_user2: id_user }
			]
		}
	});
	return friendList.map(f => ({
		friend: f.users_friendships_id_user1Tousers.id_user === id_user
		? f.users_friendships_id_user2Tousers
		: f.users_friendships_id_user1Tousers,
		friend_status: f.friend_status
	}))
}

const sendFriendship = async (id_user, id_friend) => {
	const data = { friend_status: "pending", id_user1: id_user, id_user2: id_friend };
	if (id_user > id_friend)
		data.id_user1 = id_friend, data.id_user2 = id_user;
	return await prisma.friendships.create({
		data: data
	});
}

const removeFriendship = async (id_user, id_friend) => {
	const [user1, user2] = id_user < id_friend ? [id_user, id_friend] : [id_friend, id_user]; 
	const filter = { id_user1_id_user2: { id_user1: user1, id_user2: user2 } };
	return prisma.friendships.delete({
		where: filter
	});
}

export const friendsQuery = { getAllUserFriendships, sendFriendship, removeFriendship };