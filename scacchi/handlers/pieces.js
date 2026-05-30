
import * as lib from "../lib/lib.js";
import * as piecesQuery from "../query/piecesQuery.js";
import { jsonResponse } from "../utils/response.js";


/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getAllPieces = async (req, res) => {
	try {
		const { name } = req.query;
		let pieces;
		if (name)
			pieces = await piecesQuery.findPieceByName(name);
		else
			pieces = await piecesQuery.getAllPieces();
		if (pieces && pieces.length > 0)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "pieces": pieces }));
		return res.status(404).json(jsonResponse.ResponseError("Pieces not found"));
	} catch (error) {
		console.log("Error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error searching pieces"));
	}
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getPieceById = async (req, res) => {
	try {
		const piece = await piecesQuery.getPieceById(req.params.id);
		if (piece)
			return res.status(200).json(jsonResponse.ResponseSuccess({ "piece": piece }));
		return res.status(404).json(jsonResponse.ResponseError("Piece not found"));
	} catch (error) {
		console.log("Error: ", error);
		return res.status(500).json(jsonResponse.ResponseError("Server error searching piece"));
	}
}

const getPiecesHandlers = { getAllPieces, getPieceById };

export { getPiecesHandlers };