
const lib = require("../lib/lib");
const { colors } = require("../utils/colors");
const jwt = require("../utils/auth");
const bcrypt = require("bcryptjs");
const usersQuery = require("../services/usersQuery");
const usersUtils = require("../utils/users");
const { prisma } = require("../lib/prisma")

		// const users = await prisma.users.findMany();
const getAllUsers = async (req, res) => {
	try {
		const users = await prisma.users.findMany({
			select: {
			id_user: true,
			name: true,
			surname: true,
			username: true,
			email: true,
			nationality: true,
			points: true,
			title: true
		}
		});
		res.json(users);
	} catch (error) {
		next(error);
	}
}

const getUserById = async (req, res) => {
	try {
		const user = await usersQuery.getUserById(req.params.id);
		res.json(user.rows);
	} catch (error) {
		next(error);
	}
}

const getUserByUsername = async (req, res) => {
	try {
		const user = await usersQuery.getUserByUsername(req.params.username);
		res.json(user.rows);
	} catch (error) {
		next(error);
	}
}

const getUserByEmail = async (req, res) => {
	try {
		const user = await usersQuery.getUserByUsername(req.params.email);
		res.json(user.rows);
	} catch (error) {
		next(error);
	}
}

const validateInput = async (req, res, next) => {
	/** @type {{ username: string, password: string, email: string }} */
	const { username, email, password } = req.body;
	console.log(`username: ${colors.yellow}${username}${colors.reset}, email: ${colors.yellow}${email}${colors.reset}, password: ${colors.yellow}${password}${colors.reset}`);
	if (!username || username.length < 4)
		return res.status(400).json({ error: "Username too short" });
	if (!usersUtils.checkEmail(email))
		return res.status(400).json({ error: "Invalid email format" });
	if (!usersUtils.checkPassword(password))
		return res.status(400).json({ error: "Invalid password format" });
	console.log(`Validate input: ${colors.green}OK${colors.reset}`);
	next();
}

const validateUser = async (req, res, next) => {
	try {
		const { username, email } = req.body;
		if ((await usersQuery.getUserByUsername(username)).rowCount > 0)
			return res.status(409).json({ error: "User already exists" });
		if ((await usersQuery.getUserByEmail(email)).rowCount > 0)
			return res.status(409).json({ error: "User already exists" });
		console.log(`Validate User: ${colors.green}OK${colors.reset}`);
		next();
	} catch (error) {
		next(error);
	}
}

const createUser = async (req, res) => {
	try {
		console.log(req.body);
		const { name, surname, username, email, password, nationality } = req.body;
		const hashedPwd = await bcrypt.hash(password, lib.Macro.HASH_SALT);
		const user = (await usersQuery.createUser(name, surname,username, hashedPwd, email, nationality)).rows[0];
		// console.log("🚀 ~ createUser ~ user:", user);
		const token = await jwt.createJwt(user);
		console.log("token:", token);
		res.status(201).json({ "user": user, "token": token });
	} catch (error) {
		next(error);
	}
}

const getUsersHandler = { getAllUsers, getUserById, getUserByUsername, getUserByEmail };
const createUserHandler = { validateInput, validateUser, createUser };

module.exports = { getUsersHandler, createUserHandler };