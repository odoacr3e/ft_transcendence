import { localInfo, localBoard, localPlayers }	from "@/scripts/Data/Variables";
import { PIECES_HIGHLIGHT }						from "@/scripts/Helper/piecesHighlights";
import { clearHighlight }						from "@/scripts/Helper/RenderUtils";
import { requestToBack }						from "@/scripts/Events/temp.js";

// ANCHOR USER INTERACTION FUNCTIONS
export function useAbility()
{
	const clickedId = localInfo.clickedId;
	const piece 	= localBoard.get(clickedId).piece;

	if (!piece) { return; }

	if (piece.useAbilityBool)
	{
		piece.useAbilityBool = false;
		localInfo.usingAbility = "";
	}
	else 
	{ 
		piece.useAbilityBool = true;
		localInfo.usingAbility = piece.type;
		// console.log(`who the fuck i am: ${localInfo.usingAbility}`);
	}
	PIECES_HIGHLIGHT[piece.type](clickedId);
}

export function shopAbility()
{
	const Piece = localBoard.get(localInfo.clickedId).piece;
	const Player = localPlayers.values().find(p => p.isPlaying === true);

	if (!Piece.isBoostedBool && Player.nPoints >= Piece.price)
		requestToBack(localInfo.clickedId, null).then(
			function(value) {if (value) { clearHighlight(); }},
			function(value) {if (!value) { console.log("Mossa non valida"); }}
		);
}

export function sendEndTurn()
{
	requestToBack(null, null).then(
		function(value) {if (value) { clearHighlight(); }},
		function(value) {if (!value) { console.log("Mossa non valida"); }}
	);
}

//UTILS - GENERAL UTILS

export function checkPermision(event)
{
	if (event.target.localName === "div")	{ localInfo.clickedId = event.target.id; }
	else									{ localInfo.clickedId = event.target.parentNode.id; }
	
	if (localInfo.clickedId === "" || localInfo.clickedId === "board") { return (false) };

	const Square  = localBoard.get(localInfo.clickedId);
	const Piece   = Square.piece;
	const Player  = localPlayers.values().find(p => p.isPlaying === true);

	if (Square.highlight || Square.boostedHighlight) 
		return (true);

	if (Piece && Piece.team != Player.team) { localInfo.lastClickedId = null; return false; }

	return (true);
}

export function checkForHighlightMove()
{	
	let bool

	if (localInfo.secondTurn && ((localInfo.savedBoostedMap && 
		localInfo.savedBoostedMap.has(localInfo.clickedId)) ||
		localInfo.secondMove))
		bool = true;
	else
		bool =	localBoard.get(localInfo.clickedId).highlight ||
				localBoard.get(localInfo.clickedId).boostedHighlight;
	
	if (localInfo.clickedId !== localInfo.lastClickedId)
	{
		const piece = localBoard.get(localInfo.lastClickedId)?.piece;
		if (piece && piece.type !== "Bastard" && piece.type !== "King" && !piece.useAbilityBool)
			clearHighlight();
	}
	else { clearHighlight("selected"); }
	
	return(bool);
}

export function usingAbility()
{
    const lastPiece  = localBoard.get(localInfo.lastClickedId)?.piece;
    const piece      = localBoard.get(localInfo.clickedId)?.piece;
	const secondTurn = localInfo.secondTurn;

	const lastUseAbility = lastPiece?.useAbilityBool && lastPiece?.isBoostedBool
	const useAbility	 = piece?.useAbilityBool && piece?.isBoostedBool;

    return ((localInfo.lastClickedId && (useAbility || lastUseAbility)) || secondTurn);
}

export function updatePrice()
{
	const Piece = localBoard.get(localInfo.clickedId).piece;
	const Player = localPlayers.values().find(p => p.isPlaying === true);

	if (Piece.isBoostedBool)
		localInfo.priceSelected = "This piece is already\nboosted you fool!";
	else if (Piece.price > Player.nPoints)
		localInfo.priceSelected = "AHAH! You're too poor\nto buy that!";
	else
		localInfo.priceSelected = "Price: " + Piece.price;
}