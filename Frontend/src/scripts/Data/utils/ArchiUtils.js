import { localBoard, localInfo, localPlayers } from "../Variables";

export function hasBoost (curP)
{
	localInfo.hasBoost = false;
	localBoard.forEach(square => {
		if (square.piece && square.piece.isBoostedBool)
			if (square.piece.team === curP.team)
				localInfo.hasBoost = true;
	});
}

export function checkEndTurn(validated)
{
	let		newCurP;
	const	players_list = ["p1", "p2", "p3", "p4"];
	const	curP = localPlayers.values().find(p => p.isPlaying === true);

	players_list.forEach((player) => {
		if (validated[player].isPlaying) { newCurP = validated[player]; };
	})

	if (curP.name === newCurP.name) { localInfo.secondTurn = true; }
	else
	{
		localInfo.secondTurn = false;
		localInfo.savedBoostedMap = null;
	}
}

export function DEBUGSetVisible()
{
	localBoard.forEach((square , key) => {
		if (square.piece)
		{
			const DOMPiece = document.getElementById(key).getElementsByClassName("piece")[0];
			if (DOMPiece && DOMPiece.style.visibility === "hidden")
				DOMPiece.style.visibility = "visible";
		}
	});
}