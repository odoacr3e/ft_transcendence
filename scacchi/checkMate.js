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
		throw ("given to isStoppable an invalid position");//FIXME - errore grave, dare 500
	if (enemySquare.piece?.type == enumNames.JESTER || 
	enemySquare.piece?.type == enumNames.BASTARDS || 
	(enemySquare.piece?.type == enumNames.VALKIRYA && 
	enemySquare.piece?.isBoostedBool == true) ||
	board.get(kingSquare)?.dangerZones.has(enemySquareString))
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

//TODO - passare come parametro il team per cui va fatto il check
//			o ancora meglio la posizione per cui fare il check
let CheckMateCheck= () =>
{
	let threatLevel = 0;
	let kingSquare;
	let	kingSquareString;
	let enemySquare;
	let team;

	for (let x of board)//REVIEW - Ale: io terrei la posizione di ogni re salvata
	{
		if (x[1].piece?.type == enumNames.KING)
		{
			kingSquare = x[0];
			team = x[1].piece.team;
		}
	}
	if (!kingSquare)
		throw (`missing king for team `);//FIXME - errore grave, dare 500
	kingSquareString = kingSquare;
	kingSquare = board.get(kingSquare);
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
			++threatLevel;
		}
	}
	if (threatLevel >= 2)
		return true;
	// da sistemare per i pezzi che si muovono due volte
	if (isDangerous(kingSquare.dangerZones, kingSquare.piece?.team))
		return false;
	if (!enemySquare || isStoppable(kingSquareString, enemySquare))
		return false;
	return true;
}
