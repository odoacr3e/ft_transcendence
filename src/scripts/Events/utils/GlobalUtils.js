import { localInfo, localBoard, localPlayers, MACRO }	from "@/scripts/Data/Variables";
import { PIECES_HIGHLIGHT }								from "@/scripts/Helper/piecesHighlights";
import { computePosition }								from "@floating-ui/dom";
import { clearHighlight }								from "@/scripts/Events/utils/HighlightUtils.js";
import { requestToBack }								from "@/scripts/Events/BackLink.js";

// ANCHOR USER INTERACTION FUNCTIONS
export function useAbility()
{
	const clickedId = localInfo.clickedId;
	const square 	= localBoard.get(clickedId);

	if (!square) { return; }

	if (square.useAbilityBool)
	{
		square.useAbilityBool = false;
		localInfo.usingAbility = "";
	}
	else 
	{ 
		square.useAbilityBool = true;
		localInfo.usingAbility = square.piece.type;
		if (MACRO.AUDIO)
			new Audio("/src/assets/audios/useAbility.mp3").play();
		console.log(`who the fuck i am: ${localInfo.usingAbility}`);
	}
	PIECES_HIGHLIGHT[square.piece.type](clickedId);
}

export function shopAbility()
{
	const Piece = localBoard.get(localInfo.clickedId)?.piece;
	const Player = localPlayers.values().find(p => p.isPlaying === true);

	if (!Piece?.isBoostedBool && Player.nPoints >= Piece?.price && localInfo.secondTurn)
		requestToBack(localInfo.clickedId, null).then(
			function(value) {if (value) 
			{ 
				clearHighlight();
				if (MACRO.AUDIO)
					new Audio("/src/assets/audios/boost.mp3").play(); 
			}},
			function(value) {if (!value) { console.log("Shop non completato correttamente"); }}
		);
}

export async function sendEndTurn()
{
	let response;

	response = await requestToBack(null, null);
	if (response) 
	{ 
		clearHighlight();
		if (MACRO.AUDIO)
			new Audio("/src/assets/audios/endTurn.mp3").play();
	}
	else
		console.log("End turn non mandato correttamente");
}

export async function sendGiveUp()
{
	let response;

	response = await requestToBack(null, null, 'giveup');
	if (response)
	{
		clearHighlight();
		if (MACRO.AUDIO)
			new Audio("vedemmu");
	}
	else
		console.log("Give up non mandato correttamente")
}

export function upgradeBastard(newType)
{
	requestToBack(null, newType).then(
		function(value) {if (value) 
		{ 
			localInfo.goatId = null; 
			clearHighlight(); 
			if (MACRO.AUDIO)
				new Audio("/src/assets/audios/transformation.mp3").play();
		}},
		function(value) {if (!value) { console.log("Mossa non valida"); }}
	);
}

//UTILS - GENERAL UTILS

export function moveDragClone(event)
{
	if (event.target.classList.contains("piece"))
	{
		if (event.clientX === 0 && event.clientY === 0) 
			return;

		const cursor = {
			getBoundingClientRect() {
				return {
					width: 0,
					height: 0,
					x: event.clientX,
					y: event.clientY,
					left: event.clientX,
					right: event.clientX,
					top: event.clientY,
					bottom: event.clientY
				};
			}
		};
		computePosition(cursor, localInfo.dragClone).then(({ x, y }) => {
			Object.assign(localInfo.dragClone.style, {
			top: `${y - 40}px`,
			left: `${x}px`
			});
		});
	}
}

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
	let bool;

	if (localInfo.secondTurn && ((localInfo.savedBoostedMap && 
		localInfo.savedBoostedMap.has(localInfo.clickedId)) ||
		localInfo.secondMove))
		bool = true;
	else
		bool =	localBoard.get(localInfo.clickedId).highlight ||
				localBoard.get(localInfo.clickedId).boostedHighlight;
	
	if (localInfo.clickedId !== localInfo.lastClickedId)
	{
		const square = localBoard.get(localInfo.lastClickedId);
		if (square?.piece && !["Bastards","King"].includes(square.piece.type) && !square.useAbilityBool)
			clearHighlight();
	}
	else { clearHighlight("selected"); }
	
	return(bool);
}

export function usingAbility()
{
    const lastSquare  = localBoard.get(localInfo.lastClickedId);
    const square      = localBoard.get(localInfo.clickedId);
	const secondTurn = localInfo.secondTurn;

	const lastUseAbility = lastSquare?.useAbilityBool && lastSquare?.piece.isBoostedBool;
	const useAbility	 = square.useAbilityBool && square.piece.isBoostedBool;

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