
import * as lib from "../lib/lib.js";
import { jsonResponse } from "../utils/response.js";
import { checkJwt } from "../utils/auth.js";
import { log } from "../utils/log.js";
import { prisma } from "../lib/prisma.js";
import { friendsQuery } from "../query/friendsQuery.js";
import { response } from "express";
export const friendsRouter = lib.include.express.Router();


// NOTE: /api/friends

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
friendsRouter.get('/', checkJwt, async (req, res) => {
	try {
		const friendships = await friendsQuery.getAllUserFriendships(req.user.id_user);
		console.log(friendships);
		return res.status(200).json(jsonResponse.ResponseSuccess({ friendship: friendships }));
	} catch (error) {
		console.log("Error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Internal server error"));
	}
});

// TODO: implementare websocket per ricezione notifiche amicizia
friendsRouter.post('/', checkJwt, async (req, res) => {
	try {
		await friendsQuery.sendFriendship(req.user.id_user, req.body.id_friend);
		return res.status(204).send();
	} catch (error) {
		console.log("Error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Internal server error"));
	}
})

friendsRouter.delete('/', checkJwt, async (req, res) => {
	try {
		await friendsQuery.removeFriendship(req.user.id_user, req.body.id_friend);
		return res.status(204).send();
	} catch (error) {
		console.log("Error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Internal server error"));
	}
})

friendsRouter.patch('/', checkJwt, async (req, res) => {
	try {
		// da utilizzare query per change status della amicizia
		// return res.status(200);
	} catch (error) {
		console.log("Error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Internal server error"));
	}
})