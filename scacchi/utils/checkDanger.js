// @ts-check
/** @typedef {import("../Classes/Chess/match.js").Match} Match */
/** @typedef {import("../Classes/Chess/Pieces/pieces.js").Piece} Piece */

import { enumNames } from "../Macro/enums.js";

/**
 * 
 * @param {Match} match
 * @param {Set<string> | undefined} setZones dangerZone to check
 * @param {string | undefined} team enumTeam to the piece to check
 * @param {boolean} saveInfoBool
 * @param {string} pieceCoord
 */
let isDangerous = (match, setZones, team, saveInfoBool=false, pieceCoord=match.cursor.square) =>
{
	let	board;
	let	dangerCoord = "";

	board = match.board;
	if (setZones == undefined)
		return false;
	if (team == undefined)
		throw ("isDangerous: team undefined");
	for (let x of setZones)
	{
		if (!match.board.get(x).piece)
			return (false);
		if (match.board.get(x)?.piece?.team != team)
		{
			dangerCoord = x;
			break ;
		}
	}
	if (!dangerCoord)
		return false;
	if (!saveInfoBool)
		return true;
	let	dangerSquare;

	dangerSquare = match.board.get(dangerCoord);
	if (dangerSquare.targetZones.has(pieceCoord))
		match.lastMenace = {from: dangerCoord, mid: "", to: pieceCoord};
	else
	{
		for (const [midPos, boostTargets] of dangerSquare.boostedTargetZones)
		{
			if (boostTargets.has(pieceCoord) == false)
				continue ;
			match.lastMenace = {from: dangerCoord, mid: midPos, to: pieceCoord};
			return true;
		}
		throw (`isDangerous, menace save: invalid targets`);
	}
	return true;

}

/*										dy/dx	dy/dx	dy/dx
	red/white: SOUTH, dy positivo  -->	1, 0	1,-1	1,1
	yellow/black: NORTH dy negativo		-1, 0	-1,-1	-1,1
	blue: WEST dx positivo				0, 1	-1,1	1,1
	green: EAST dx positivo				0, -1	-1,-1	1,-1
*/
let bastardMove = // aggiornato movimenti
{
	white: new Set(["1|0", "1|1", "1|-1"]),
	yellow: new Set(["1|0", "1|1", "1|-1"]),
	black: new Set(["-1|0", "-1|-1", "-1|1"]),
	red: new Set(["-1|0", "-1|-1", "-1|1"]),
	blue: new Set(["0|1", "-1|1", "1|1"]),
	green: new Set(["0|-1", "-1|-1", "1|-1"])
}

/**
 * 
 * @param {Match} match
 * @param {Number} dy
 * @param {Number} dx
 * @param {*} piece
 */
function bastardChecks(match, dy, dx, piece)
{
	let	target;
	let	startPos;
	let	targetPos;

	if (piece.type != enumNames.BASTARDS)
		return true;
	//@ts-ignore
	if (!bastardMove[piece.team])
		throw ("bastardChecks: unknown piece team")
	// @ts-ignore
	match.cursor.Save();
	startPos = match.cursor.square;
	if (match.cursor.moveRow(dy) == false)
		return (false);
	if (match.cursor.moveCol(dx) == false)
		return (match.cursor.Restore(), false);
	if (match.board.get(match.cursor.square).wallBool == true)
		return (match.cursor.Restore(), false);
	match.board.AddInfluence(startPos, match.cursor.square);//@ts-ignore
	if (!bastardMove[piece.team].has(`${dy}|${dx}`))
		return (match.cursor.Restore(), false);
	targetPos = match.cursor.square;
	target = match.board.get(targetPos).piece;
	if (dx != 0 && dy != 0)//NOTE - bastards moves diagonally
	{
		match.board.get(targetPos).dangerZones.add(startPos);
		match.cursor.Restore();
		if (!target || target.team == piece.team)
			return (false);
		match.board.get(startPos).targetZones.add(targetPos);
		return (true);
	}
	else if (target)//NOTE - bastards moves front
	{
		addLongBastardInfluence(match, dx, dy, startPos, piece);
		return (match.cursor.Restore(), false);
	}
	match.board.get(startPos).targetZones.add(targetPos);
	addLongBastardInfluence(match, dx, dy, startPos, piece);
	if (match.board.get(match.cursor.square).wallBool == true)
		return (match.cursor.Restore(), false);
	if (!piece.isMovedBool && !match.board.get(match.cursor.square).piece)
	{
		match.board.get(startPos).targetZones.add(match.cursor.square);
		// match.board.get(match.cursor.square).dangerZones.add(startPos);
	}
	match.cursor.Restore();
	return (true);
}

/**
 * 
 * @param {Match} match 
 * @param {number} dx 
 * @param {number} dy 
 * @param {string} startPos 
 * @param {Piece} piece
 */
function addLongBastardInfluence(match, dx, dy, startPos, piece)
{
	match.cursor.Restore();
	match.cursor.moveRow(dy + dy);
	match.cursor.moveCol(dx + dx);
	if (!piece.isMovedBool)
		match.board.AddInfluence(startPos, match.cursor.square);
}

/**
 * 
 * @param {Match} match 
 */
function checkKingDanger(match)
{
	let	kingSquare;

	kingSquare = match.board.get(match.currentPlayer.King);
	return (isDangerous(match, kingSquare.dangerZones, match.currentPlayer.team));
}

export {bastardChecks, isDangerous, checkKingDanger};