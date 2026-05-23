
const lib = require("../lib/lib");
const jwt = require("../utils/auth");
const bcrypt = require("bcryptjs");
const usersQuery = require("../query/usersQuery");
const { jsonResponse } = require("../utils/response.js");
const { checkInputs } = require("../utils/users.js");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getAllUsers = async (req, res) => {
	try {
		const { username } = req.query;
		let users;
		if (username)
			users = await usersQuery.findUserByUsername(username);
		else
			users = await usersQuery.getAllUsers();
		if (users && users.length > 0)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "users": users }));
		return res.status(404).json(jsonResponse.ResponseError("User not found"));
	} catch (error) {
		console.log("Prisma: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error"));
	}
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getUserById = async (req, res) => {
	try {
		const user = await usersQuery.getUserById(req.params.id);
		if (user)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "user": user }));
		return res.status(404).json(jsonResponse.ResponseError("User not found"));
	} catch (error) {
		return res.status(500).json(jsonResponse.ResponseError("Server error"));
	}
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const deleteUserById = async (req, res) => {
	try {
		const user = await usersQuery.deleteUserById(req.params.id);
		if (user)
			return res.status(204).send();
		return res.status(404).json(jsonResponse.ResponseError("User not found"));
	} catch (error) {
		if (error.code === 'P2025')
			return res.status(404).json(jsonResponse.ResponseError("User not found"));
		console.log("Error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error"));
	}
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const updateUserById = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const inputs = checkInputs(username, email, password);
		if (inputs != "OK")
			return res.status(400).json(jsonResponse.ResponseError(inputs));
		const user = await usersQuery.updateUserFieldsById(req.params.id, req.body);
		delete(user.password);
		if (user)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "user": user }));
		return res.status(404).json(jsonResponse.ResponseError("User not found"));
	} catch (error) {
		console.log("Error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error"));
	}
};

const getUsersHandler = { getAllUsers, getUserById };
const deleteUserHandler = { deleteUserById };
const updateUserHandler = { updateUserById };

module.exports = { getUsersHandler, deleteUserHandler, updateUserHandler };