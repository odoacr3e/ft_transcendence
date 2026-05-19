import { localBoard, localPlayers, localInfo }	from "@/scripts/Data/Variables";
import { clearHighlight, resetPrice }			from "@/scripts/Helper/RenderUtils";
import { PIECES_HIGHLIGHT }						from "@/scripts/Helper/piecesHighlights";
import { boostedMovement } 						from "@/scripts/Helper/abilityMovement";
import { computePosition }						from "@floating-ui/dom";
import { requestToBack }						from "./Movements.js";
import { getRootDiv }							from "@/scripts/Helper/Constants";

// ANCHOR USER INTERACTION FUNCTIONS

function useAbility()
{
	const clickedId = localInfo.clickedId;
	const piece 	= localBoard.get(clickedId).piece;

	if (!piece) 
		return;
	if (piece.useAbilityBool)
		piece.useAbilityBool = false;
	else 
	{ 
		piece.useAbilityBool = true; 
		//chiamata alla funzione mvimento?
	}

	PIECES_HIGHLIGHT[piece.type](clickedId);
}

function shopAbility()
{
	const Piece = localBoard.get(localInfo.clickedId).piece;
	const Player = localPlayers.values().find(p => p.isPlaying === true);

	if (!Piece.isBoostedBool && Player.nPoints >= Piece.price)
		requestToBack(localInfo.clickedId, null).then(
			function(value) {if (value) { clearHighlight(); }},
			function(value) {if (!value) { console.log("Mossa non valida"); }}
		);
}

function sendEndTurn()
{
	requestToBack(null, null).then(
		function(value) {if (value) { clearHighlight(); }},
		function(value) {if (!value) { console.log("Mossa non valida"); }}
	);
}

// ANCHOR EVENT-LISTENERS FUNCTIONS

async function globalEvents()
{
	const ROOT_DIV = getRootDiv();

	ROOT_DIV.addEventListener("click", function (event) {
		if (!checkPermision(event))	{ clearHighlight(); return; }
		// console.log(`CID: ${localInfo.clickedId}, LCID: ${localInfo.lastClickedId}`);
		if (checkForHighlightMove()) 
		{
			if (usingAbility())
			{
				boostedMovement(); 
				return;
			}
			sendToBackend(); 
		}
		else
			highlightOnClick(event);
	});

	ROOT_DIV.addEventListener("dragstart", function (event) {
		if ((localInfo.secondMove && localInfo.savedBoostedMap && 
			localInfo.savedBoostedMap.has(event.target.parentNode.id)) || !localInfo.secondMove)
			highlightOnDrag(event);
	});

	ROOT_DIV.addEventListener("mousedown", function (event) {
		rightClickSelect(event);
	});

	ROOT_DIV.addEventListener("drag", function (event) {
		if (event.target.className === "piece")
		{
			if (event.clientX === 0 && event.clientY === 0) return;

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
	});

	ROOT_DIV.addEventListener('dragend', function(event) {
		if (event.target.className === 'piece' && !localInfo.dropDone)
			event.target.style.visibility = 'visible';
		if (localInfo.dropDone) { localInfo.dropDone = false; }

		if (localInfo.dragClone) {
			localInfo.dragClone.remove();
			localInfo.dragClone = null;
		}
	});
}

async function sendToBackend(flag)
{
	const lastClickedId = localInfo.lastClickedId;
	const clickedId = localInfo.clickedId;
	const pMoving = localBoard.get(lastClickedId).piece ? localBoard.get(lastClickedId).piece : null;

	let TargetZone;

	if (pMoving?.useAbilityBool && pMoving?.type !== ("Bastards" || "King"))
		TargetZone = localBoard.get(lastClickedId).boostedTargetZones.has(clickedId);
	else
		TargetZone = localBoard.get(lastClickedId).targetZones.has(clickedId);

	if (lastClickedId && lastClickedId !== clickedId && TargetZone)
	{
		const promise = await requestToBack(localInfo.lastClickedId, localInfo.clickedId)
		if (promise) 
		{
			clearHighlight();
			if (flag)
				return (true);
		}
		else
		{
			console.log("[sendToBackend]: Mossa non valida");
			if (flag)
				return (false);
		}
	}
}

// ANCHOR UTILS FUNCTIONS

function checkPermision(event)
{
	if (event.target.localName === "div")	{ localInfo.clickedId = event.target.id; }
	else									{ localInfo.clickedId = event.target.parentNode.id; }
	
	if (localInfo.clickedId === "" || localInfo.clickedId === "board") { return (false) }; //dragging multiplo strano

	const Piece = localBoard.get(localInfo.clickedId).piece;
	const Player = localPlayers.values().find(p => p.isPlaying === true);
	 	
	if (Piece && Piece.team != Player.team) { localInfo.lastClickedId = null; return false; }

	return true;
}

function checkForHighlightMove()
{	
	let bool

	if (localInfo.secondTurn && ((localInfo.savedBoostedMap && 
		localInfo.savedBoostedMap.has(localInfo.clickedId)) ||
		localInfo.secondMove))
		bool = true;
	else
		bool = localBoard.get(localInfo.clickedId).highlight;
	
	if (localInfo.clickedId !== localInfo.lastClickedId)
	{
		const piece = localBoard.get(localInfo.lastClickedId)?.piece;
		if (piece && piece.type !== ("Bastard" || "King") && !piece.useAbilityBool)
			clearHighlight();
	}
	else { clearHighlight("selected"); }

	return(bool);
}

function usingAbility()
{
    const lastPiece  = localBoard.get(localInfo.lastClickedId)?.piece;
    const piece      = localBoard.get(localInfo.clickedId)?.piece;
	const secondTurn = localInfo.secondTurn;

	const lastUseAbility = lastPiece?.useAbilityBool && lastPiece?.isBoostedBool
	const useAbility	 = piece?.useAbilityBool && piece?.isBoostedBool;

    return ((localInfo.lastClickedId && (useAbility || lastUseAbility)) || secondTurn);
}

function updatePrice()
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

// ANCHOR HIGHLIGHT AND SELECT FUNCTIONS

function setHighlightTrue(toSet, flag, team)
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

function highlightOnClick(event)
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

function highlightOnDrag(event)
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
		localInfo.lastClickedId = event.target.parentNode.id;
		resetPrice();
	}
}

function rightClickSelect(event)
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

export { globalEvents, sendToBackend, useAbility, shopAbility, sendEndTurn, setHighlightTrue };