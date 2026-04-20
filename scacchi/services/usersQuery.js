
const { db } = require("./dbConnection");

const getAllUsers = async () => {
	return await db.query("SELECT * FROM users");
}

const getUserById = async (id) => {
	return await db.query("SELECT * FROM users WHERE id_user = $1", [id]);
}

module.exports = { getAllUsers, getUserById };
