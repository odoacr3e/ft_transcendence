
import * as lib from "../lib/lib.js"
const { prisma } = lib.conn;

/**
 * utente A si connette
 * → JWT decode → id_user = A
 * → SELECT amici di A dal DB
 * → per ogni amico X in lista:
 * 		se X è in clientMap (cioè è online):
 * 			socket di X riceve "friend:online" { userId: A }
 * 			socket di A riceve "friend:online" { userId: X }  ← così A sa chi è già online
 * → al disconnect:
 * 		per ogni amico X in lista:
 * 			se X è in clientMap:
 * 				socket di X riceve "friend:offline" { userId: A }
 */

/**
 * @param {import("socket.io").Server} sockio
 * @param {Map<number, string>} clientMap
 */
export async function announceMeOnline(sockio, user, clientMap, friendsId) {
	const friends = await prisma.friendships.findMany({
		where: {
			OR: [
				{id_user1: user.id_user},
				{id_user2: user.id_user}
			],
			friend_status: 'accepted'
		}
	});
	friendsId = friends.map(f => {
		return f.id_user1 == user.id_user ? f.id_user2 : f.id_user1
	});
	for (const id of friendsId)
	{
		const friendSocket = clientMap.get(id);
		if (friendSocket)
		{
			sockio.to(friendSocket.socket.id).emit('friend:online', { userId: user.id_user }); // comunico all'amico (id) online che sono online
			clientMap.get(user.id_user).socket.emit('friend:online', { userId: id }); // comunico a me stesso che quell'amico e online, altrimenti lo vedrei solo alla sua riconnessione
		}
	}
	return friendsId;
}