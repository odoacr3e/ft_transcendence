
const { db } = require("./dbConnection");

const getAllUsers = async () => {
	return await db.query("SELECT id_user, name, surname, username, email, nationality, image, preferences, points, title FROM users");
}

const getUserById = async (id) => {
	return await db.query("SELECT id_user, name, surname, username, email, nationality, image, preferences, points, title FROM users WHERE id_user = $1", [id]);
}

const getUserByUsername = async (username) => {
	return await db.query("SELECT id_user, name, surname, username, email, nationality, image, preferences, points, title FROM users WHERE username = $1", [username]);
}

const getUserByEmail = async (email) => {
	return await db.query("SELECT id_user, name, surname, username, email, nationality, image, preferences, points, title FROM users WHERE email = $1", [email]);
}

const createUser = async (name, surname, username, password, email, nationality) => {
	return await db.query("INSERT INTO users (name, surname, username, password, email, nationality) VALUES \
	($1, $2, $3, $4, $5, $6) RETURNING id_user, name, surname, username, email, nationality;", [name, surname, username, password, email, nationality]);
}

module.exports = { getAllUsers, getUserById, getUserByUsername, getUserByEmail, createUser };
