
const lib = require("../lib/lib");
const jwt = require("../utils/auth");
const bcrypt = require("bcryptjs");
const usersQuery = require("../query/usersQuery");
const { jsonResponse } = require("../utils/response.js");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getAllUsers = async (req, res) => {
	try {
		const users = await usersQuery.getAllUsers();
		if (users)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "user": users }));
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

const getUsersHandler = { getAllUsers, getUserById };
const deleteUserHandler = { deleteUserById };

module.exports = { getUsersHandler, deleteUserHandler };