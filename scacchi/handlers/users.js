
const lib = require("../lib");
const usersQuery = require("../services/usersQuery");

const getAllUsers = async (req, res) => {
	const users = await usersQuery.getAllUsers();
	res.json(users.rows);
}

const getUserById = async (req, res) => {
	const user = await usersQuery.getUserById(req.params.id);
	res.json(user.rows);
}

const getUserByUsername = async (req, res) => {
	const user = await usersQuery.getUserByUsername(req.params.username);
	res.json(user.rows);
}

module.exports = { getAllUsers, getUserById, getUserByUsername };