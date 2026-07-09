// @ts-check

//SECTION - checkDanger function
/*
	list of exports:
	-	isDangerous:		checks if a piece is in danger.
	-	checkKingDanger:	checks if the currentPlayer king is in danger.
*/

/** @typedef {import("../Classes/Chess/match.js").Match} Match */
/** @typedef {import("../Classes/Chess/Pieces/pieces.js").Piece} Piece */

/**
 * checks if a piece is in danger.
 * if saveInfoBool is true, the danger info are saved into the Match object.
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

/**
 * checks if the currentPlayer king is in danger.
 * @param {Match} match 
 */
function checkKingDanger(match)
{
	let	kingSquare;

	kingSquare = match.board.get(match.currentPlayer.King);
	return (isDangerous(match, kingSquare.dangerZones, match.currentPlayer.team));
}

export {isDangerous, checkKingDanger};