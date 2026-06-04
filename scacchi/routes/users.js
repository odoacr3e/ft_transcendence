
import * as lib from "../lib/lib.js";
import * as usersQuery from "../query/usersQuery.js";
import { checkInputs } from "../utils/users.js";
import { checkJwt } from "../utils/auth.js";
import { jsonResponse } from "../utils/response.js"
import { printLog } from "../utils/log.js"
import { colors } from "../utils/colors.js";
export const usersRouter = lib.include.express.Router();

// NOTE: route /api/users/


// NOTE: solo user loggati, ricerca tutti gli utenti con query su username
usersRouter.get("/", checkJwt, async (req, res) => {
	try {
		const { username } = req.query;
		const users = username ? await usersQuery.findUserByUsername(username) : await usersQuery.getAllUsers();
		if (users && users.length > 0)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "users": users }));
		return res.status(404).json(jsonResponse.ResponseError("User not found"));
	} catch (error) {
		printLog(`User not found due to a server error: ${error.name}`, colors.brightRed);
		return res.status(500).json(jsonResponse.ResponseError("Server error"));
	}
});

usersRouter.get("/me", checkJwt, async (req, res) => {
	try {
		const user = await usersQuery.getUserById(req.user.id_user);
		if (user)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "user": user }));
		return res.status(404).json(jsonResponse.ResponseError("User not found"));
	} catch (error) {
		printLog(`User not found due to a server error: ${error.name}`, colors.brightRed);
		return res.status(500).json(jsonResponse.ResponseError("Server error"));
	}
});

// NOTE: solo user loggati, ricerca per id
usersRouter.get("/:id", checkJwt, async (req, res) => {
	try {
		const { id } = req.params;
		const user = await usersQuery.getUserById(id);
		if (user)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "user": user }));
		return res.status(404).json(jsonResponse.ResponseError("User not found"));
	} catch (error) {
		printLog(`User not found due to a server error: ${error.name}`, colors.brightRed);
		return res.status(500).json(jsonResponse.ResponseError("Server error"));
	}
});

// NOTE: solo user loggati, delete su utente richiedente
usersRouter.delete("/", checkJwt, async (req, res) => {
	try {
		const user = await usersQuery.deleteUserById(req.user.id_user);
		if (user)
		{
			printLog(`User ${user.username} successfully deleted`, colors.brightYellow);
			return res.status(204).send();
		}
		return res.status(404).json(jsonResponse.ResponseError("User not found"));
	} catch (error) {
		if (error.code === 'P2025')
			return res.status(404).json(jsonResponse.ResponseError("User not found"));
		printLog(`User not found due to a server error: ${error.name}`, colors.brightRed);
		return res.status(500).json(jsonResponse.ResponseError("Server error"));
	}
});

// NOTE: solo user loggati, patch su utente richiedente
usersRouter.patch("/", checkJwt, async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const inputs = checkInputs(username, email, password);
		if (inputs != "OK")
			return res.status(400).json(jsonResponse.ResponseError(inputs));
		const user = await usersQuery.updateUserFieldsById(req.user.id_user, req.body);
		delete(user.password);
		if (user)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "user": user }));
		return res.status(404).json(jsonResponse.ResponseError("User not found"));
	} catch (error) {
		printLog(`User not found due to a server error: ${error.name}`, colors.brightRed);
		return res.status(500).json(jsonResponse.ResponseError("Server error"));
	}
});
