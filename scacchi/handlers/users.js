
const lib = require("../lib");
const usersQuery = require("../services/usersQuery");

const getAllUsers = async (request, response) => {
	const users = await usersQuery.getAllUsers();
	response.json(users.rows);
}

const getUserById = async (request, response) => {
	const user = await usersQuery.getUserById(request.params.id);
	response.json(user.rows);
}

const getUserByUsername = async (request, response) => {
	const user = await usersQuery.getUserByUsername(request.params.username);
	response.json(user.rows);
}

module.exports = { getAllUsers, getUserById, getUserByUsername };