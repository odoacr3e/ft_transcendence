
import * as lib from "../lib/lib.js";
import { jsonResponse } from "../utils/response.js";
import { checkJwt } from "../utils/auth.js";
import { log } from "../utils/log.js";
import {  } from "../query/preferencesQuery.js";
import { response } from "express";
const { prisma } = lib.conn;
export const prefRouter = lib.include.express.Router();

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
prefRouter.get('/', async (req, res) => {
	try {
		const preferences = await prisma.preferences.findMany();
		return res.status(200).json(jsonResponse.ResponseSuccess(preferences));
	} catch (error) {
		console.log("Error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error retrieving preferences list"));
	}
});

prefRouter.get('/:id', async (req, res) => {
	try {
		const preferences = await prisma.preferences.findUnique({ where: { id_preference: Number(req.params.id) } });
		return res.status(200).json(jsonResponse.ResponseSuccess(preferences));
	} catch (error) {
		console.log("Error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error retrieving preferences list"));
	}
});