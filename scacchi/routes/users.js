
import * as lib from "../lib/lib.js";
import * as usersQuery from "../query/usersQuery.js";
import bcrypt from "bcryptjs"
import { checkInputs, checkEmail, checkPassword, checkUsername } from "../utils/users.js";
import { checkJwt } from "../utils/auth.js";
import { jsonResponse } from "../utils/response.js"
import { log } from "../utils/log.js"
import { colors } from "../utils/colors.js";
export const usersRouter = lib.include.express.Router();

// NOTE: route /api/users/

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * NOTE: solo user loggati, ricerca tutti gli utenti con query su username
*/
usersRouter.get("/", checkJwt, async (req, res) => {
	try {
		const { username } = req.query;
		const users = username ? await usersQuery.findUserByUsername(username) : await usersQuery.getAllUsers();
		if (users && users.length > 0)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "users": users }));
		return res.status(404).json(jsonResponse.ResponseError("Users not found"));
	} catch (error) {
		// printLog(`User not found due to a server error: ${error.name}`, colors.brightRed);
		return res.status(500).json(jsonResponse.ResponseError("Server error"));
	}
});

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * NOTE: solo user loggati, ricerca tutti gli utenti con query su username
*/
usersRouter.get("/me", checkJwt, async (req, res) => {
	try {
		const user = await usersQuery.getUserById(req.user.id_user);
		if (user)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "user": user }));
		return res.status(404).json(jsonResponse.ResponseError("User not found"));
	} catch (error) {
		// printLog(`User not found due to a server error: ${error.name}`, colors.brightRed);
		return res.status(500).json(jsonResponse.ResponseError("Server error"));
	}
});

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * NOTE: solo user loggati, ricerca tutti gli utenti con query su username
*/
usersRouter.get('/leaderboard', async (req, res) => {
	try {
		const list = await usersQuery.getLeaderboard();
		if (list)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "list": list }));
		return res.status(400).json(jsonResponse.ResponseError("Not much users for leaderboard"));
	} catch (error) {
		console.log("Error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error while retrieving leaderboard"));
	}
});

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * NOTE: solo user loggati, ricerca tutti gli utenti con query su username
*/
usersRouter.get('/username/:username', checkJwt, async (req, res) => {
	try {
		const user = await usersQuery.getUserByUsername(req.params.username);
		if (user)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "user": user }));
		return res.status(404).json(jsonResponse.ResponseError("User not found"));
	} catch (error) {
		console.log("Error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error"));
	}
})

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * NOTE: solo user loggati, ricerca per id
*/
usersRouter.get("/:id", checkJwt, async (req, res) => {
	try {
		const { id } = req.params;
		const user = await usersQuery.getUserById(id);
		if (user)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "user": user }));
		return res.status(404).json(jsonResponse.ResponseError("User not found"));
	} catch (error) {
		// printLog(`User not found due to a server error: ${error.name}`, colors.brightRed);
		return res.status(500).json(jsonResponse.ResponseError("Server error"));
	}
});

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * NOTE: solo user loggati, delete su utente richiedente
*/
usersRouter.delete("/", checkJwt, async (req, res) => {
	try {
		const user = await usersQuery.deleteUserById(req.user.id_user);
		if (user)
		{
			// printLog(`User ${user.username} successfully deleted`, colors.brightYellow);
			return res.status(204).send();
		}
		return res.status(404).json(jsonResponse.ResponseError("User not found"));
	} catch (error) {
		if (error.code === 'P2025')
			return res.status(404).json(jsonResponse.ResponseError("User not found"));
		// printLog(`User not found due to a server error: ${error.name}`, colors.brightRed);
		return res.status(500).json(jsonResponse.ResponseError("Server error"));
	}
});

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * NOTE: solo user loggati, patch su utente richiedente
*/
usersRouter.patch("/", checkJwt, async (req, res) => {
	try {
		const { username } = req.body;
		if (!username)
			return res.status(400).json(jsonResponse.ResponseError("Username parameter not found"));			
		if (!checkUsername(username))
			return res.status(400).json(jsonResponse.ResponseError("Invalid username format"));
		const user = await usersQuery.updateUserFieldsById(req.user.id_user, req.body);
		delete(user.password);
		if (user)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "user": user }));
		return res.status(404).json(jsonResponse.ResponseError("User not found"));
	} catch (error) {
		if (error.code = 'P2002')
			return res.status(404).json(jsonResponse.ResponseError("Username already taken"));
		// printLog(`User not found due to a server error: ${error.name}`, colors.brightRed);
		return res.status(500).json(jsonResponse.ResponseError("Server error changing user params"));
	}
});

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * NOTE: reset e cambio password per utente loggato
*/
usersRouter.patch('/updatePassword', checkJwt, async (req, res) => {
	try {
		const { password } = req.body;
		if (!checkPassword(password))
			return res.status(400).json(jsonResponse.ResponseError("Invalid password format"));
		const user = await usersQuery.updateUserPassword(req.user.id_user, await bcrypt.hash(password, parseInt(lib.Macro.HASH_SALT)))
		if (user)
			return res.status(204).send();
		return res.status(404).json(jsonResponse.ResponseError("User not found"));
	} catch (error) {
		console.log("Error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error changing user password"));
	}
});
