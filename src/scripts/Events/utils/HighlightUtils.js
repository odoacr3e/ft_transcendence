import { localInfo, localBoard, localPlayers }	from "@/scripts/Data/Variables";
import { clearHighlight, resetPrice }			from "@/scripts/Helper/RenderUtils";
import { PIECES_HIGHLIGHT }						from "@/scripts/Helper/piecesHighlights";
import { updatePrice }							from "./GlobalUtils";

// UTILS - HIGHLIGHT AND SELECT FUNCTIONS

export function setHighlightTrue(toSet, flag, team)
{
	toSet.forEach((highlight) => {
		const square = localBoard.get(highlight);
		if (!square || square.id === localInfo.clickedId)
			return;

		const canHighlight = team === "both" || square.piece?.team !== team;
		if (!canHighlight)
			return;

		if (flag === "regular")
			square.highlight = true;
		else if (flag === "boosted")
			square.boostedHighlight = true;
		
	});
}

export function highlightOnClick(event)
{
	if (event.target.localName === "img")
	{
		updatePrice();
		if (localInfo.clickedId === localInfo.lastClickedId) 
		{
			clearHighlight();
			localInfo.lastClickedId = null;
			return;
		}
		const piece = localBoard.get(localInfo.clickedId).piece.type;
		PIECES_HIGHLIGHT[piece](localInfo.clickedId);
		localInfo.lastClickedId = localInfo.clickedId;
	}
	else
	{
		localInfo.lastClickedId = null;
		resetPrice();
	}
}

export function highlightOnDrag(event)
{
	if (event.target.localName === "img")
	{
		const clickedId = event.target.parentNode.id;
		if (clickedId != localInfo.lastClickedId)
			clearHighlight();

		const Piece = localBoard.get(clickedId).piece;
		const Player = localPlayers.values().find(p => p.isPlaying === true);
	 	
		if (Piece.team != Player.team) { return; }

		// non so perche' ma non funziona al 100%...
		PIECES_HIGHLIGHT[Piece.type](clickedId);
		if (localInfo.savedBoostedMap && localInfo.savedBoostedMap.has(clickedId))
			localBoard.get(clickedId).boostedHighlight = true;
		resetPrice();
	}
}

export function rightClickSelect(event)
{
	if (event.button == 2)
	{
		event.preventDefault();
		clearHighlight("highlight");
		localInfo.lastClickedId = null;
		resetPrice();
		let targetSquare;
		if (event.target.localName === "img")
		{
			targetSquare = localBoard.get(event.target.parentNode.id);
			console.log(targetSquare.id);
		}
		else
		{	
			targetSquare = localBoard.get(event.target.id);
			console.log(targetSquare.id);
		}

		if (targetSquare && !targetSquare.selected)
			targetSquare.selected = true;
		else if (targetSquare.selected)
			targetSquare.selected = false;
	}
}