// @ts-check
const {cursor} = 	require("./cursor.js");
const {Piece, board, Square} =					require("./lib.js").Chess;
const {eTeam, enumValues, enumNames} =			require("./lib.js").Enums;
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
 * 
 * @param {string} kingSquare 
 * @param {string} enemySquare 
 * @returns 
 */
function isStoppable(kingSquare, enemySquare)
{
	if (board.get(enemySquare)?.piece?.type == enumNames.JESTER || 
	board.get(enemySquare)?.piece?.type == enumNames.BASTARDS || 
	(board.get(enemySquare)?.piece?.type == enumNames.VALKIRYA && 
	board.get(enemySquare)?.piece?.isBoostedBool == true) ||
	board.get(kingSquare)?.dangerZones.has(enemySquare))
		return false;
	let dir = getDirection(kingSquare, enemySquare);
	cursor.setCursor(cursor.getRow() + dir.diffRow, cursor.getCol() + dir.diffCol);
	while (board.get(cursor.square)?.piece?.type != enumNames.KING)
	{
		for (let x of board.get(cursor.square)?.dangerZones)
		{
			if (board.get(x)?.piece?.team == board.get(kingSquare)?.piece?.team)
				return true;
		}
		cursor.setCursor(cursor.getRow() + dir.diffRow, cursor.getCol() + dir.diffCol);
	}
	return false;
}

let CheckMateCheck= () =>
{
	let threatLevel = 0;
	let kingSquare;
	let enemySquare;
	let team;

	for (let x of board)
	{
		if (x[1].piece?.type == enumNames.KING)
		{
			kingSquare = x[0];
			team = x[1].piece.team;
		}
	}
	if (!isDangerous(board.get(kingSquare)?.dangerZones, team))
		return false;
	for (let x of board.get(kingSquare)?.targetZones)
	{
		if (!isDangerous(board.get(x)?.dangerZones, team) && board.get(x)?.piece == null)
			return false;
	}
	for (let x of board.get(kingSquare)?.dangerZones)
	{
		if (board.get(x)?.piece?.team != team)
		{
			enemySquare = x;
			++threatLevel;
		}
	}
	if (threatLevel >= 2)
		return true;
	// da sistemare per i pezzi che si muovono due volte
	if (isDangerous(board.get(kingSquare)?.dangerZones, board.get(kingSquare)?.piece?.team))
		return false;
	if (isStoppable(kingSquare, enemySquare))
		return false;
	return true;
}