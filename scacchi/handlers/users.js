
const lib = require("../lib");
const usersQuery = require("../services/usersQuery");

const getAllUsers = async (request, response) => {
	const users = await usersQuery.getAllUsers();
	response.json(users);
}

const getUserById = async (request, response) => {
	const user = await usersQuery.getUserById(request.params.id);
	response.json(user);
}

module.exports = { getAllUsers, getUserById };