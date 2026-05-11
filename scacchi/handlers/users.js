
const lib = require("../lib/lib");
const jwt = require("../utils/auth");
const bcrypt = require("bcryptjs");
const usersQuery = require("../services/usersQuery");
// const usersUtils = require("../utils/users");
const { prisma } = require("../lib/prisma.js");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getAllUsers = async (req, res) => {
	try {
		const users = await prisma.users.findMany({
			select: {
				id_user: true,
				name: true,
				surname: true,
				username: true,
				email: true,
				nationality: true,
				points: true,
				preferences: true
			}
		});
		if (users)
			return res.json(users);
		return res.status(404).json({ error: "User not found" });
	} catch (error) {
		console.log("Prisma: ", error);
		return res.status(500).json({ error: "Server error" });
	}
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getUserById = async (req, res) => {
	try {
		const user = await prisma.users.findUnique({
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
				id_user: Number(req.params.id)
			}
		});
		if (user)
			return res.json(user);
		return res.status(404).json({ error: "User not found" });
	} catch (error) {
		return res.status(500).json({ error: "Server error" });
	}
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getUserByUsername = async (req, res) => {
	try {
		const user = await prisma.users.findUnique({
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
				id_user: String(req.params.id)
			}
		});
		if (user)
			return res.json(user);
		return res.status(404).json({ error: "User not found" });
	} catch (error) {
		return res.status(500).json({ error: "Server error" });
	}
}

const getUserByEmail = async (req, res) => {
	try {
		const user = await prisma.users.findUnique({
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
				id_user: String(req.params.email)
			}
		});
		if (user)
			return res.json(user);
		return res.status(404).json({ error: "User not found" });
	} catch (error) {
		return res.status(500).json({ error: "Server error" });
	}
}

const getUsersHandler = { getAllUsers, getUserById, getUserByUsername, getUserByEmail };

module.exports = { getUsersHandler };