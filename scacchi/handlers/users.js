
const lib = require("../lib/lib");
const jwt = require("../utils/auth");
const bcrypt = require("bcryptjs");
const usersQuery = require("../query/usersQuery");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getAllUsers = async (req, res) => {
	try {
		const users = await usersQuery.getAllUsers();
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
		const user = await usersQuery.getUserById(req.params.id);
		if (user)
			return res.json(user);
		return res.status(404).json({ error: "User not found" });
	} catch (error) {
		return res.status(500).json({ error: "Server error" });
	}
}

const getUsersHandler = { getAllUsers, getUserById };

module.exports = { getUsersHandler };