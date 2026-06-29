
import bcrypt from "bcryptjs";
import * as lib from "../lib/lib.js";
const { prisma } = lib.conn;

export const getAllUsers = async () => {
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

export const getUserById = async (id) => {
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
export const findUserByUsername = async (username) => {
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

export const getUserByUsername = async (username) => {
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

export const getUserByEmail = async (email) => {
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

export const getLeaderboard = async () => {
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
export const createUser = async (name, surname, username, password, email, nationality) => {
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
			}
		}
	});
}

export const deleteUserById = async (id) => {
	return await prisma.users.delete({
		where: { id_user: Number(id) }
	});
}

export const updateUserFieldsById = async (id, data) => {
	const fields = ['name', 'surname', 'username', 'nationality', 'image', 'preferences'];
	const updates = {};
	for (const f of fields)
	{
		if (data[f] !== undefined)
			updates[f] = data[f];
		if (data.preferences && f === 'preferences')
			updates.preferences = { connect: { id_preference: Number(data[f]) }};
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
			}
		}
	});
}

export const updateUserPassword = async (id_user, password) => {
	return await prisma.users.update({
		where: {id_user: Number(id_user)},
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
