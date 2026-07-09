
import { prisma } from "../lib/prisma.js";

export async function getAllUsers() {
	return await prisma.users.findMany({
		select: {
			id_user: true,
			name: true,
			surname: true,
			username: true,
			email: true,
			nationality: true,
			points: true,
			preferences: {
				select: {
					name: true,
					description: true,
					colors: true,
				}
			}
		},
		orderBy: {
			id_user: 'asc'
		}
	});
}

export async function getUserById(id) {
	return await prisma.users.findUnique({
		select: {
			id_user: true,
			name: true,
			surname: true,
			username: true,
			email: true,
			image: true,
			nationality: true,
			points: true,
			title: true,
			preferences: {
				select: {
					name: true,
					description: true,
					colors: true,
				}
			}
		},
		where: {
			id_user: Number(id)
		}
	});
}

// NOTE: cerca un utente che contiene come username lo username passato
// e possibile passare anche solo una parte dello username -> passando 'Mario' trovera 'Mariorossi' 'supermario' oppure 'robomarione'
export async function findUserByUsername(username) {
	return await prisma.users.findMany({
		select: {
			id_user: true,
			name: true,
			surname: true,
			username: true,
			email: true,
			image: true,
			nationality: true,
			points: true,
			title: true,
			preferences: {
				select: {
					name: true,
					description: true,
					colors: true,
				}
			}
		},
		where: {
			username: {
				contains: String(username),
				mode: 'insensitive'
			}
		},
		orderBy: {
			id_user: 'asc'
		}
	});
}

export async function getUserByUsername (username) {
	return await prisma.users.findUnique({
			select: {
				id_user: true,
				name: true,
				surname: true,
				username: true,
				email: true,
				image: true,
				nationality: true,
				points: true,
				title: true,
				preferences: {
					select: {
						name: true,
						description: true,
						colors: true,
					}
				}
			},
			where: {
				username: String(username)
			}
		});
}

export async function getUserByUsernameWithPwd (username) {
	return await prisma.users.findUnique({
		select: {
			id_user: true,
			name: true,
			surname: true,
			username: true,
			password: true,
			email: true,
			image: true,
			nationality: true,
			points: true,
			title: true,
			preferences: {
				select: {
					name: true,
					description: true,
					colors: true,
				}
			},
			mfa: true
		},
		where: {
			username: String(username)
		}
	});
}

export async function getUserByEmail(email) {
	return await prisma.users.findUnique({
			select: {
				id_user: true,
				name: true,
				surname: true,
				username: true,
				email: true,
				image: true,
				nationality: true,
				points: true,
				title: true,
				preferences: {
					select: {
						name: true,
						description: true,
						colors: true,
					}
				}
			},
			where: {
				id_user: String(email)
			}
		});
}

export async function getLeaderboard() {
	return await prisma.users.findMany({
		select: {
				id_user: true,
				username: true,
				image: true,
				nationality: true,
				points: true,
				title: true
			},
		orderBy: [
			{ points: 'asc' }, 
			{ name: 'asc' }
		],
		take: 10
	});
}

/**
 * @description Asyncronous function for creating users with Prisma client
 * @param {String} name 
 * @param {String} surname 
 * @param {String} username 
 * @param {String} password
 * @param {String} email
 * @param {String} nationality 
 */
export async function createUser(name, surname, username, password, email, nationality) {
	return await prisma.users.create({
		data: {
			name: name,
			surname: surname,
			username: username,
			email: email,
			password: password,
			nationality: nationality
		},
		select: {
			id_user: true,
			name: true,
			surname: true,
			username: true,
			email: true,
			image: true,
			nationality: true,
			points: true,
			title: true,
			preferences: {
				select: {
					name: true,
					description: true,
					colors: true,
				}
			},
			mfa: true
		}
	});
}

export async function deleteUserById(id) {
	return await prisma.users.delete({
		where: { id_user: Number(id) }
	});
}

export async function updateUserFieldsById(id, data) {
	const fields = ['name', 'surname', 'username', 'nationality', 'image', 'preferences', 'mfa'];
	const updates = {};
	for (const f of fields)
	{
		if (data[f] !== undefined)
			updates[f] = data[f];
		if (data.preferences && f === 'preferences')
			updates.preferences = { connect: { id_preference: Number(data[f]) }};
		if (data.mfa && f === 'mfa')
		{
			const user = await prisma.users.findUnique({
				where: { id_user: Number(id) },
				select: { mfa: true }
			});
			if (data.mfa !== user.mfa)
				updates.preferences = data.mfa;
		}
	}
	return await prisma.users.update({
		where: { id_user: Number(id) },
		data: updates,
		select: {
			id_user: true,
			name: true,
			surname: true,
			username: true,
			email: true,
			image: true,
			nationality: true,
			points: true,
			title: true,
			preferences: {
				select: {
					name: true,
					description: true,
					colors: true,
				}
			},
			mfa: true
		}
	});
}

export async function updateUserPasswordByUsername(username, password) {
	return await prisma.users.update({
		where: {username: username},
		data: { password: password },
		select: {
			id_user: true,
			name: true,
			surname: true,
			username: true,
			email: true,
			image: true,
			nationality: true,
			points: true,
			title: true,
			preferences: {
				select: {
					name: true,
					description: true,
					colors: true,
				}
			}
		}
	});
}

export async function updateUserPasswordById(id_user, password) {
	return await prisma.users.update({
		where: {id_user: id_user},
		data: { password: password },
		select: {
			id_user: true,
			name: true,
			surname: true,
			username: true,
			email: true,
			image: true,
			nationality: true,
			points: true,
			title: true,
			preferences: {
				select: {
					name: true,
					description: true,
					colors: true,
				}
			}
		}
	});
}
