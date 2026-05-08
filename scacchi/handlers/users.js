
const lib = require("../lib/lib");
const { colors } = require("../utils/colors");
const jwt = require("../utils/auth");
const bcrypt = require("bcryptjs");
const usersQuery = require("../services/usersQuery");
const usersUtils = require("../utils/users");
const { prisma } = require("../lib/prisma.js")

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
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
		if (users)
			return res.json(users);
		return res.status(404).json({ error: "User not found" });
	} catch (error) {
		console.log("Prisma: ", error);
		return res.status(500).json({ error: "Server error" });
	}
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getUserById = async (req, res) => {
	try {
		const user = await prisma.users.findUnique({
			select: {
				id_user: true,
				name: true,
				surname: true,
				username: true,
				email: true,
				image: true,
				nationality: true,
				points: true,
				title: true,
				preferences: true
			},
			where: {
				id_user: Number(req.params.id)
			}
		});
		if (user)
			return res.json(user);
		return res.status(404).json({ error: "User not found" });
	} catch (error) {
		return res.status(500).json({ error: "Server error" });
	}
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getUserByUsername = async (req, res) => {
	try {
		const user = await prisma.users.findUnique({
			select: {
				id_user: true,
				name: true,
				surname: true,
				username: true,
				email: true,
				image: true,
				nationality: true,
				points: true,
				title: true,
				preferences: true
			},
			where: {
				id_user: String(req.params.id)
			}
		});
		if (user)
			return res.json(user);
		return res.status(404).json({ error: "User not found" });
	} catch (error) {
		return res.status(500).json({ error: "Server error" });
	}
}

const getUserByEmail = async (req, res) => {
	try {
		const user = await prisma.users.findUnique({
			select: {
				id_user: true,
				name: true,
				surname: true,
				username: true,
				email: true,
				image: true,
				nationality: true,
				points: true,
				title: true,
				preferences: true
			},
			where: {
				id_user: String(req.params.email)
			}
		});
		if (user)
			return res.json(user);
		return res.status(404).json({ error: "User not found" });
	} catch (error) {
		return res.status(500).json({ error: "Server error" });
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
		const user = await prisma.users.create({
			data: {
				name: name,
				surname: surname,
				username: username,
				email: email,
				password: hashedPwd,
				nationality: nationality
			},
			select: {
				id_user: true,
				name: true,
				surname: true,
				username: true,
				email: true,
				image: true,
				nationality: true,
				points: true,
				title: true,
				preferences: true
			}
		});
		if (!user)
			return res.status(500).json({ error: "Server error creating user" });
		req.user = user;
		const token = await jwt.createJwt(req, res);
		return res.status(201).json({ "user": user, "token": token });
	} catch (error) {
		return res.status(500).json({ error: "Server error creating user" });
	}
}

const getUsersHandler = { getAllUsers, getUserById, getUserByUsername, getUserByEmail };
const createUserHandler = { validateInput, validateUser, createUser };

module.exports = { getUsersHandler, createUserHandler };
//FEATURE: UPDATE | fatto update users handlers da query manuali a prisma | scacchi/handlers/users.js, scacchi/routes/users.js