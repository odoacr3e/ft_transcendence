// @ts-check
const {cursor} = 								require("./cursor.js");
const {Piece, board, Square, preset} =			require("./lib/lib.js").Chess;
const {eTeam, enumValues, enumNames} =			require("./lib/lib.js").Enums;
const {isDangerous, movePiece, DangerUpdate} =	require("./utils.js");

/**
 * 
 * @param {string} kingSquare 
 * @param {string} enemySquare 
 */
function getDirection(kingSquare, enemySquare)
{
	let rowK, rowE, diffRow;
	let colK, colE, diffCol;

	cursor.square = kingSquare;
	rowK = cursor.getRow();
	colK = cursor.getCol();
	cursor.square = enemySquare;
	rowE = cursor.getRow();
	colE = cursor.getCol();
	diffRow = rowK - rowE;
	diffCol = colK - colE;
	if (diffRow != 0)
		diffRow /= Math.abs(diffRow);
	if (diffCol != 0)
		diffCol /= Math.abs(diffCol);
	return ({diffRow, diffCol});
}

/**
 * Checks if a piece that is menacing the king can be eaten
 * @param {string} kingSquare 
 * @param {string} enemySquareString 
 * @returns {boolean} 
 */
function isStoppable(kingSquare, enemySquareString)
{
	let	square;
	let	enemySquare;

	enemySquare = board.get(enemySquareString);
	if (!enemySquare)
		throw ("given to isStoppable an invalid position");//FIXME - Ale: errore grave, dare 500
	if (enemySquare.piece?.type == enumNames.JESTER || 
	enemySquare.piece?.type == enumNames.BASTARDS || 
	(enemySquare.piece?.type == enumNames.VALKIRYA && 
	enemySquare.piece?.isBoostedBool == true) ||
	board.get(kingSquare)?.targetZones.has(enemySquareString))
		return false;
	let dir = getDirection(kingSquare, enemySquareString);
	cursor.setCursor(cursor.getRow() + dir.diffRow, cursor.getCol() + dir.diffCol);
	while (board.get(cursor.square)?.piece?.type != enumNames.KING)
	{
		square = board.get(cursor.square);
		if (!square || !square.dangerZones)
			continue ;
		for (let x of square.dangerZones)
		{
			if (board.get(x)?.piece?.team == board.get(kingSquare)?.piece?.team)
				return true;
		}
		cursor.setCursor(cursor.getRow() + dir.diffRow, cursor.getCol() + dir.diffCol);
	}
	return false;
}

/**
 * 
 * @param {string} startPos 
 * @param {string} target 
 * @returns 
 */
function canEat(startPos, target)
{
	cursor.set(startPos);
	cursor.setCol(cursor.getCol() - 1);
	if (cursor.square != target)
	{
		cursor.setCol(cursor.getCol() + 2);
		if (cursor.square != target)
		{
			cursor.set(startPos);
			return true;
		}
	}
	cursor.set(startPos);
	return false;
}

/**
 * 
 * @param {Set<string>} threat 
 */
function doubleSave(threat)
{
	let arr = Array.from(threat);
	let	square1;
	let	square2;

	square1 = board.get(arr[0]);
	if (!square1)
		return false;
	square2 = board.get(arr[1]);
	if (!square2)
		return false;
	for (let x of square1.dangerZones)
	{
		if (square2.dangerZones.has(x) && board.get(x)?.piece?.team != square1.piece?.team && board.get(x)?.piece?.isBoostedBool && 
		(board.get(x)?.piece?.type == enumNames.MINOTAURUS || board.get(x)?.piece?.type == enumNames.CHAMPION))
		{
			let threat = board.get(x);
			if (threat == undefined)
				return false;
			for (let [key, value] of threat.boostedTargetZones)
			{
				if ((key == arr[0] && value.has(arr[1])) || (key == arr[1] && value.has(arr[0])))
					return true;
			}
		}
		else if (board.get(x)?.piece?.team != square1.piece?.team && 
		board.get(x)?.piece?.isBoostedBool && board.get(x)?.piece?.type == enumNames.BASTARDS)
		{
			let startPos = x;
			if (canEat(x, arr[1]))
			{
				cursor.set(x);
				for (let [dx, dy] of preset.Champion.movement)
				{
					cursor.setCursor(cursor.getRow() + dx, cursor.getCol() + dy)
					if (board.get(cursor.square)?.piece?.team != square1.piece?.team && board.get(cursor.square)?.targetZones.has(arr[1]))
						return true;
					cursor.set(startPos);
				}
			}
		}
		else if (board.get(x)?.piece?.team != square1.piece?.team)
		{
			let startPos = x;
			cursor.set(x);
			for (let [dx, dy] of preset.Champion.movement)
			{
				cursor.setCursor(cursor.getRow() + dx, cursor.getCol() + dy)
				if (board.get(cursor.square)?.piece?.team != square1.piece?.team && board.get(cursor.square)?.targetZones.has(arr[1]) && (
					board.get(cursor.square)?.piece?.type == enumNames.BASTARDS && board.get(cursor.square)?.piece?.isBoostedBool == true && canEat(cursor.square, arr[0])))
					return true;
				cursor.set(startPos);
			}
		}
	}
	return false;
}

/**
 * 
 * @param {string} kingSquareString
 */
let CheckMateCheck= (kingSquareString) =>
{
	let threat = new Set;
	let kingSquare;
	let enemySquare;
	let team;

	kingSquare = board.get(kingSquareString);
	if (!kingSquare)
		throw (`missing king for team `);//FIXME - Ale: errore grave, dare 500
	team = kingSquare.piece?.team;
	if (!kingSquare || !isDangerous(kingSquare.dangerZones, team))
		return false;
	for (let x of kingSquare.targetZones)
	{
		if (!isDangerous(board.get(x)?.dangerZones, team) && board.get(x)?.piece == null)
			return false;
	}
	for (let x of kingSquare.dangerZones)
	{
		if (board.get(x)?.piece?.team != team)
		{
			enemySquare = x;
			threat.add(enemySquare);
		}
	}
	if (threat.size == 2 && doubleSave(threat))
		return true;
	if (threat.size >= 2)
		return true;
	if (!enemySquare) // ts-check stuff
		return false;
	let enemySet = board.get(enemySquare)?.dangerZones;
	if (!enemySet) // ts-check stuff
		return false;
	if (isDangerous(enemySet, team) && enemySet.has(kingSquareString))
		enemySet?.delete(kingSquareString);
	if (isDangerous(enemySet, board.get(enemySquare)?.piece?.team))
		return false;
	if (!enemySquare || isStoppable(kingSquareString, enemySquare))
		return false;
	return true;
}

module.exports = {CheckMateCheck, getDirection};