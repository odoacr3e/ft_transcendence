
const { connect } = require("node:http2");
const { prisma } = require("../lib/prisma.js");
const bcrypt = require("bcryptjs");
const lib = require("../lib/lib.js");

const getAllUsers = async () => {
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
		}
	});
}

const getUserById = async (id) => {
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
			preferences: true
		},
		where: {
			id_user: Number(id)
		}
	});
}

const getUserByUsername = async (username) => {
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
				preferences: true
			},
			where: {
				username: String(username)
			}
		});
}

const getUserByEmail = async (email) => {
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
				preferences: true
			},
			where: {
				id_user: String(email)
			}
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
const createUser = async (name, surname, username, password, email, nationality) => {
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

const deleteUserById = async (id) => {
	return await prisma.users.delete({
		where: { id_user: Number(id) }
	});
}

const updateUserFieldsById = async (id, data) => {
	const fields = ['name', 'surname', 'username', 'email', 'nationality', 'image', 'password', 'preferences'];
	const updates = {};
	for (const f of fields)
	{
		if (data[f] !== undefined)
			updates[f] = data[f];
		if (data.preferences && f === 'preferences')
			updates.preferences = { connect: { id_preference: Number(data[f]) }};
		if (data.password && f === 'password')
			updates.password = await bcrypt.hash(updates.password, parseInt(lib.Macro.HASH_SALT));
	}
	return await prisma.users.update({
		where: { id_user: Number(id) },
		data: updates
	});
}

module.exports = { getAllUsers, getUserById, getUserByUsername, getUserByEmail, createUser, deleteUserById, updateUserFieldsById };
