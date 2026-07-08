//@ts-check

/** @typedef {import("../Classes/Chess/match").Match} Match*/

/**
 * returns an array of {from, to} legal moves about the currentPlayer  
 * @param {Match} match 
 * */
function getLegalMoves(match)
{
	let	currTeam;
	let	targetSquare;
	/** @type {Map<string, Set<string>>} */
	let	legalMovesMap = new Map();
	/** @type {Array<{from: string, to: string}>} */
	let	legalMovesArray = new Array();

	for (const [coord, square] of match.board)
	{
		for (const targetCoord of square.targetZones)
		{
			targetSquare = match.board.get(targetCoord);
			if (targetSquare.piece?.team == square.piece?.team)
				continue ;
			if (legalMovesMap.has(coord) == false)
				legalMovesMap.set(coord, new Set());
			legalMovesMap.get(coord)?.add(targetCoord);
		}
	}
	currTeam = match.currentPlayer.team;
	do
	{
		
	}
	while (match.currentPlayer.team )
	return (legalMovesArray);
}