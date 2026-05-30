// @ts-check
/** @typedef {import("../Classes/Match/match").Match} Match */

import { enumNames } from "../Macro/enums.js";

/**
 * 
 * @param {*} match
 * @param {Set<string> | undefined} setZones dangerZone to check
 * @param {string | undefined} team enumTeam to the piece to check
 */
let isDangerous = (match, setZones, team) =>
{
	let	board;

	board = match.board;
	if (setZones == undefined)
		return false;
	if (team == undefined)
		throw ("isDangerous: team undefined");
	for (let x of setZones)
	{
		if (!match.board.get(x).piece)
			throw new Error(`isDangerous: piece in ${x} undefined`);
		if (match.board.get(x)?.piece?.team != team)
			return (true);
	}
	return false;
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
	red: new Set(["1|0", "1|1", "1|-1"]),
	black: new Set(["-1|0", "-1|-1", "-1|1"]),
	yellow: new Set(["-1|0", "-1|-1", "-1|1"]),
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

	if (piece.type != enumNames.BASTARDS)
		return true;
	//@ts-ignore
	if (!bastardMove[piece.team])
		throw ("bastardChecks: unknown piece team")
	// @ts-ignore
	if (!bastardMove[piece.team].has(`${dy}|${dx}`))
		return false;
	match.cursor.Save();
	startPos = match.cursor.square;
	if (match.cursor.moveRow(dy) == false)
		return (false);
	if (match.cursor.moveCol(dx) == false)
		return (match.cursor.Restore(), false);
	target = match.board.get(match.cursor.square)?.piece;
	if (dx != 0 && dy != 0)//NOTE - bastards moves diagonally
	{
		match.board.get(match.cursor.square).dangerZones.add(startPos);
		match.cursor.Restore();
		if (!target || target.team == piece.team)
			return (false);
		return (true);
	}
	else if (target)//NOTE - bastards moves front
		return (match.cursor.Restore(), false);
	match.cursor.Restore();
	match.cursor.moveRow(dy + dy);
	match.cursor.moveCol(dx + dx);
	if (!piece.isMovedBool && !match.board.get(match.cursor.square).piece)
	{
		match.board.get(startPos).targetZones.add(match.cursor.square);
		match.board.get(match.cursor.square).dangerZones.add(startPos);
	}
	match.cursor.Restore();
	return (true);
}

export {bastardChecks, isDangerous};