
const lib = require("../lib");
const { colors } = require("../utils/colors");
const bcrypt = require("bcryptjs");
const usersQuery = require("../services/usersQuery");
const usersUtils = require("../utils/users")

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

const getUserByEmail = async (req, res) => {
	const user = await usersQuery.getUserByUsername(req.params.email);
	res.json(user.rows);
}

// check parametri corretti OK
// cercare se esiste email | username OK
// creare utente sul DB e ritornare /api/users/:id

const validateInput = async (req, res, next) => {
	/** @type {{ username: string, password: string, email: string }} */
	const { username, email, password } = req.body;
	console.log(`username: ${colors.yellow}${username}${colors.reset}, email: ${colors.yellow}${email}${colors.reset}, password: ${colors.yellow}${password}${colors.reset}`);
	if (!username || username < 3)
		return res.status(400).json({ error: "Username too short" });
	if (!usersUtils.checkEmail(email))
		return res.status(400).json({ error: "Invalid email format" });
	if (!usersUtils.checkPassword(password))
		return res.status(400).json({ error: "Invalid password format" });
	console.log(`Validate input: ${colors.green}OK${colors.reset}`);
	next();
}

const validateUser = async (req, res, next) => {
	const { username, email } = req.body;
	if ((await usersQuery.getUserByUsername(username)).rowCount > 0)
		return res.status(409).json({ error: "User already exists" });
	if ((await usersQuery.getUserByEmail(email)).rowCount > 0)
		return res.status(409).json({ error: "User already exists" });
	console.log(`Validate User: ${colors.green}OK${colors.reset}`);
	next();
}

const createUser = async (req, res) => {
	console.log(req.body);
	const { name, surname, username, email, password, nationality } = req.body;
	const hashedPwd = await bcrypt.hash(password, lib.Macro.HASH_SALT);
	const user = await usersQuery.createUser(name, surname,username, hashedPwd, email, nationality);
	res.status(201).location(`/api/users/${user.rows[0].id_user}`).json(user.rows[0]);
}

const getUsersHandler = { getAllUsers, getUserById, getUserByUsername, getUserByEmail };
const createUserHandler = { createUser, validateUser, validateInput };

module.exports = { getUsersHandler, createUserHandler };