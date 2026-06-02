
import * as lib from "../lib/lib.js";
import * as usersQuery from "../query/usersQuery.js";
import { checkInputs } from "../utils/users.js";
import { checkJwt } from "../utils/auth.js";
import { jsonResponse } from "../utils/response.js"
export const usersRouter = lib.include.express.Router();

// NOTE: route /api/users/
usersRouter.get("/", /* checkJwt, */ async (req, res) => {
	try {
		const { username } = req.query;
		const users = username ? await usersQuery.findUserByUsername(username) : await usersQuery.getAllUsers();
		if (users && users.length > 0)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "users": users }));
		return res.status(404).json(jsonResponse.ResponseError("User not found"));
	} catch (error) {
		console.log("Prisma: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error"));
	}
});

usersRouter.get("/:id", checkJwt, async (req, res) => {
	try {
		const { id } = req.params;
		const user = await usersQuery.getUserById(id);
		if (user)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "user": user }));
		return res.status(404).json(jsonResponse.ResponseError("User not found"));
	} catch (error) {
		return res.status(500).json(jsonResponse.ResponseError("Server error"));
	}
});

usersRouter.delete("/:id", async (req, res) => {
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
});

usersRouter.patch("/:id", async (req, res) => {
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
});
