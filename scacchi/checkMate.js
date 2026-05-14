// @ts-check
const {preset} =			require("./lib/lib.js").Chess;
const {enumNames} =			require("./Macro/enums.js");
const {Match} = require("./Classes/Vault/match.js");
const {isDangerous} =	require("./utils.js");

/**
 * 
 * @param {Match} match
 * @param {string} kingSquare 
 * @param {string} enemySquare 
 */
function getDirection(match, kingSquare, enemySquare)
{
	let rowK, rowE, diffRow;
	let colK, colE, diffCol;

	match.cursor.square = kingSquare;
	rowK = match.cursor.getRow();
	colK = match.cursor.getCol();
	match.cursor.square = enemySquare;
	rowE = match.cursor.getRow();
	colE = match.cursor.getCol();
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
 * @param {Match} match
 * @param {string} kingSquare 
 * @param {string} enemySquareString 
 * @returns {boolean} 
 */
function isStoppable(match, kingSquare, enemySquareString)
{
	let	square;
	let	enemySquare;

	enemySquare = match.board.get(enemySquareString);
	if (!enemySquare)
		throw ("given to isStoppable an invalid position");//FIXME - Ale: errore grave, dare 500
	if (enemySquare.piece?.type == enumNames.JESTER || 
	enemySquare.piece?.type == enumNames.BASTARDS || 
	(enemySquare.piece?.type == enumNames.VALKIRYA && 
	enemySquare.piece?.isBoostedBool == true) ||
	match.board.get(kingSquare)?.targetZones.has(enemySquareString))
		return false;
	let dir = getDirection(match, kingSquare, enemySquareString);
	match.cursor.setCursor(match.cursor.getRow() + dir.diffRow, match.cursor.getCol() + dir.diffCol);
	while (match.board.get(match.cursor.square)?.piece?.type != enumNames.KING)
	{
		square = match.board.get(match.cursor.square);
		if (!square || !square.dangerZones)
			continue ;
		for (let x of square.dangerZones)
		{
			if (match.board.get(x)?.piece?.team == match.board.get(kingSquare)?.piece?.team)
				return true;
		}
		match.cursor.setCursor(match.cursor.getRow() + dir.diffRow, match.cursor.getCol() + dir.diffCol);
	}
	return false;
}

/**
 * 
 * @param {Match} match
 * @param {string} startPos 
 * @param {string} target 
 * @returns 
 */
function canEat(match, startPos, target)
{
	match.cursor.set(startPos);
	match.cursor.setCol(match.cursor.getCol() - 1);
	if (match.cursor.square != target)
	{
		match.cursor.setCol(match.cursor.getCol() + 2);
		if (match.cursor.square != target)
		{
			match.cursor.set(startPos);
			return true;
		}
	}
	match.cursor.set(startPos);
	return false;
}

/**
 * 
 * @param {Match} match
 * @param {Set<string>} threat 
 */
function doubleSave(match, threat)
{
	let arr = Array.from(threat);
	let	square1;
	let	square2;

	square1 = match.board.get(arr[0]);
	if (!square1)
		return false;
	square2 = match.board.get(arr[1]);
	if (!square2)
		return false;
	for (let x of square1.dangerZones)
	{
		if (square2.dangerZones.has(x) && match.board.get(x)?.piece?.team != square1.piece?.team && match.board.get(x)?.piece?.isBoostedBool && 
		(match.board.get(x)?.piece?.type == enumNames.MINOTAURUS || match.board.get(x)?.piece?.type == enumNames.CHAMPION))
		{
			let threat = match.board.get(x);
			if (threat == undefined)
				return false;
			for (let [key, value] of threat.boostedTargetZones)
			{
				if ((key == arr[0] && value.has(arr[1])) || (key == arr[1] && value.has(arr[0])))
					return true;
			}
		}
		else if (match.board.get(x)?.piece?.team != square1.piece?.team && 
		match.board.get(x)?.piece?.isBoostedBool && match.board.get(x)?.piece?.type == enumNames.BASTARDS)
		{
			let startPos = x;
			if (canEat(match, x, arr[1]))
			{
				match.cursor.set(x);
				for (let [dx, dy] of preset.Champion.movement)
				{
					match.cursor.setCursor(match.cursor.getRow() + dx, match.cursor.getCol() + dy)
					if (match.board.get(match.cursor.square)?.piece?.team != square1.piece?.team && match.board.get(match.cursor.square)?.targetZones.has(arr[1]))
						return true;
					match.cursor.set(startPos);
				}
			}
		}
		else if (match.board.get(x)?.piece?.team != square1.piece?.team)
		{
			let startPos = x;
			match.cursor.set(x);
			for (let [dx, dy] of preset.Champion.movement)
			{
				match.cursor.setCursor(match.cursor.getRow() + dx, match.cursor.getCol() + dy)
				if (match.board.get(match.cursor.square)?.piece?.team != square1.piece?.team && match.board.get(match.cursor.square)?.targetZones.has(arr[1]) && (
					match.board.get(match.cursor.square)?.piece?.type == enumNames.BASTARDS && match.board.get(match.cursor.square)?.piece?.isBoostedBool == true && canEat(match, match.cursor.square, arr[0])))
					return true;
				match.cursor.set(startPos);
			}
		}
	}
	return false;
}

/**
 * 
 * @param {Match} match
 * @param {string} kingSquareString
 */
function CheckMateCheck(match, kingSquareString)
{
	let threat = new Set;
	let kingSquare;
	let enemySquare;
	let team;

	kingSquare = match.board.get(kingSquareString);
	if (!kingSquare)
		throw (`missing king for team `);
	team = kingSquare.piece?.team;
	if (!isDangerous(match, kingSquare.dangerZones, team))
		return false;
	for (let x of kingSquare.targetZones)
	{
		if (!isDangerous(match, match.board.get(x)?.dangerZones, team) && match.board.get(x)?.piece == null)
			return false;
	}
	for (let x of kingSquare.dangerZones)
	{
		if (match.board.get(x)?.piece?.team != team)
		{
			enemySquare = x;
			threat.add(enemySquare);
		}
	}
	if (threat.size == 2 && doubleSave(match, threat))
		return true;
	if (threat.size >= 2)
		return true;
	if (!enemySquare) // ts-check stuff
		return false;
	let enemySet = match.board.get(enemySquare)?.dangerZones;
	if (!enemySet) // ts-check stuff
		return false;
	if (isDangerous(match, enemySet, team) && enemySet.has(kingSquareString))
		enemySet?.delete(kingSquareString);
	if (isDangerous(match, enemySet, match.board.get(enemySquare)?.piece?.team))
		return false;
	if (!enemySquare || isStoppable(match, kingSquareString, enemySquare))
		return false;
	return true;
}

module.exports = {CheckMateCheck, getDirection};