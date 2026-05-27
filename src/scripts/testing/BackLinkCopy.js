import { Square } from "./Variables.js";

export async function requestToBack(fromSquare, toSquare, type, )
{
	try
	{
		const response = await fetch("http://localhost:8080/api/game", {
		  method: "POST",
		  headers: 
		  { 
			"Content-Type": "application/json",
			"Connection": "close"  
		  },
		  body: JSON.stringify({ type: type, from: fromSquare, to: toSquare }),
		});

		if (!response.ok) throw new Error(`Impossibile caricare /move.json: ${response.status}`);

		const match = await response.json();

		if (type != "reload")
			updateMatchState(match);
		else
			return (parseObject(match));
		return match;
	}
	catch (err)
	{
		console.error(err);
		return null;
	}
}


export function parseObject(receivedMatch)
{
	let	localBoard;

	localBoard = new Map();
	if (!receivedMatch.board)
		return (receivedMatch);

	if (receivedMatch && typeof receivedMatch === 'object') {
		Object.entries(receivedMatch.board).forEach(([squareId, squareData]) => {

				const targetZones = new Set(Array.isArray(squareData.targetZones)
					? squareData.targetZones
					: [])
				
				const boostedTargetZones = new Map(
				  Object.entries(squareData.boostedTargetZones || {}).map(([key, value]) => {
					// console.log(`key: ${key}, value: ${value}`);
					return [key, new Set(Array.isArray(value) ? value : [])];
				  })
				);

				const square = new Square(
				squareId,
				squareData.piece || null,
				targetZones,
				boostedTargetZones
			);
			localBoard.set(squareId, square);
		});
	}
	receivedMatch.board = localBoard; 
	return receivedMatch;
}
