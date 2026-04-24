
const { db } = require("./dbConnection");

const getAllUsers = async () => {
	return await db.query("SELECT * FROM users");
}

const getUserById = async (id) => {
	return await db.query("SELECT * FROM users WHERE id_user = $1", [id]);
}

const getUserByUsername = async (username) => {
	return await db.query("SELECT username, name, surname FROM users WHERE username = $1", [username]);
}

module.exports = { getAllUsers, getUserById, getUserByUsername };
