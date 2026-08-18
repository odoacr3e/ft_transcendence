//@ts-check

import { arrayInitNames, arrayInitTeam, arrayNames, eEvents } from "../Macro/enums.js";
import {getRandomValues} from "crypto";

/** @typedef {import("../Classes/Globals/globals.js").globals} Globals*/
/** @typedef {import("../Classes/Chess/match.js").Match} Match*/
/** @typedef {import("../Classes/Chess/chessBoard.js").Square} Square*/
/** @typedef {import("../Classes/Chess/history.js").HistoryEvent} HistoryEvent*/
/** @typedef {import("../Classes/Chess/Pieces/pieces.js").Piece} Piece*/

const COMBINATIONS = arrayNames.length * 2;//tipo pezzo	+ colori team
const METADATA = 2;//0: non boostato; 1: boostato
const SQUARE_COMBINATION = COMBINATIONS * METADATA;
const SAVED_POINTS = 16;//oltre 16 non ha senso separare
const TABLE_SIZE = BigInt((2 << 20) - 1);
const zobristTable = 
{
	/** @type {Array<BigInt>} */
	board: [],
	/** @type {Array<BigInt>} */
	points: [],
}

/**
 * 
 */
function zobristGenerateTable()
{
	let	array64 = new BigUint64Array(1);

	//				tipo pezzo			colori team
	for (let x = 0; x != 64 * SQUARE_COMBINATION; x += SQUARE_COMBINATION)
	{
		for (let y = 0; y != SQUARE_COMBINATION; y += METADATA)
		{
			for (let z = 0; z != METADATA; z += 1)
			{
				getRandomValues(array64);
				zobristTable.board[x + y + z] = array64[0];
				console.log(array64[0]);
			}
		}
	}
	for (let x = 0; x != (SAVED_POINTS * 2) + 1; x += 1)
	{
		getRandomValues(array64);
		zobristTable.points[x] = array64[0];
	}
}

/**
 * initialize the hash
 * @param {Match} match 
 */
function zobristInitHash(match)
{
	let	i;
	let	hash = BigInt(0);

	i = 0;
	for (const [coord, square] of match.board)
	{
		hash ^= zobristPieceHash(i, square.piece);
		i += 1;
	}
	hash ^= zobristPointsHash(match.white.nPoints, match.black.nPoints);
	match._zobristHash = hash;
	match.zobristIndex = Number(hash & TABLE_SIZE);
}

/**
 * 
 * @param {Match} match 
 * @param {HistoryEvent} event 
 */
function zobristUpdateHash(match, event)
{
	/** @type {Square} */
	let	fromSquare;
	/** @type {Square | undefined} */
	let	toSquare;
	let	fromHash;
	let	toHash;

	fromSquare = match.board.get(event.from);
	if (event.to)
		toSquare = match.board.get(event.to);
	fromHash = zobristPieceHash(fromSquare.index, fromSquare.piece);
	toHash = zobristPieceHash(toSquare?.index, toSquare?.piece);
	if (event.fromHash != fromHash)
	{
		match._zobristHash ^= event.fromHash;
		match._zobristHash ^= fromHash;
	}
	if (toHash && event.toHash != toHash)
	{
		match._zobristHash ^= event.toHash;
		match._zobristHash ^= toHash;
	}
	if (event.points.WHITE != match.white.nPoints || event.points.BLACK != match.black.nPoints)
	{
		match._zobristHash ^= zobristPointsHash(event.points.WHITE, event.points.BLACK);
		match._zobristHash ^= zobristPointsHash(match.white.nPoints, match.black.nPoints);
	}
	match.zobristIndex = Number(match._zobristHash & TABLE_SIZE);
}

//SECTION - utils

/**
 * get the random number associated with the unique combination of:
 *  *type*, *team*, *boostedBool*, *coord*
 * @param {number | undefined} boardCount 
 * @param {Piece | undefined | null} piece 
 */
function zobristPieceHash(boardCount, piece)
{
	let	i;

	if (!piece || boardCount == undefined)
		return (BigInt(0));
	i = boardCount * SQUARE_COMBINATION;
	i += arrayInitNames.indexOf(piece.type[0]);
	i += arrayInitTeam.indexOf(piece.team[0]) * arrayInitNames.length;
	i += piece.isBoostedBool? 1 : 0;
	return (zobristTable.board[i]);
}

/**
 * get the random number associated with the unique combination of:
 *  *black_points*, *white_points*
 * @param {number} pWhite
 * @param {number} pBLack
 */
function zobristPointsHash(pWhite, pBLack)
{
	pWhite = pWhite > SAVED_POINTS ? SAVED_POINTS : pWhite;
	// 16 - 31
	pBLack = pBLack > SAVED_POINTS ? SAVED_POINTS : pBLack;
	return (zobristTable.points[pWhite] ^ zobristTable.points[pBLack + SAVED_POINTS]);
}

export {zobristGenerateTable, zobristInitHash, zobristUpdateHash, zobristPieceHash};