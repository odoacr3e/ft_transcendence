import { localBoard, localPlayers, localInfo }	from "@/scripts/Data/Variables";
import { clearHighlight, resetPrice }			from "@/scripts/Helper/RenderUtils";
import { PIECES_HIGHLIGHT }						from "@/scripts/Helper/piecesHighlits";
import { requestToBack }						from "./Movements.js";
import { getRootDiv }							from "@/scripts/Helper/Constants";


export function useAbility()
{
	if (!localBoard.get(localInfo.clickedId).piece) { return; }
	if (localBoard.get(localInfo.clickedId).piece.useAbilityBool)
		localBoard.get(localInfo.clickedId).piece.useAbilityBool = false;
	else { localBoard.get(localInfo.clickedId).piece.useAbilityBool = true; }

	PIECES_HIGHLIGHT[localBoard.get(localInfo.clickedId).piece.type](localInfo.clickedId);
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

export function checkPermision(event)
{
	if (event.target.localName === "div")	{ localInfo.clickedId = event.target.id; }
	else									{ localInfo.clickedId = event.target.parentNode.id; }
	
	if (localInfo.clickedId === "" || localInfo.clickedId === "board") { return (false) }; //dragging multiplo strano

	const Piece = localBoard.get(localInfo.clickedId).piece;
	const Player = localPlayers.values().find(p => p.isPlaying === true);
	 	
	if (Piece && Piece.team != Player.team) { localInfo.lastClickedId = null; return false; }

	return true;
}

export function globalEvents()
{
	const ROOT_DIV = getRootDiv();

	ROOT_DIV.addEventListener("click", function (event) {
		if (!checkPermision(event))			{ clearHighlight(); return; }
		if (checkForHighlightMove())		{ sendToBackend(); }
		else 								{ highlightOnClick(event); }
	});

	ROOT_DIV.addEventListener("dragstart", function (event) {
		highlightOnDrag(event);
	});

	ROOT_DIV.addEventListener("mousedown", function (event) {
		rightClickSelect(event);
	});

}

export function checkForHighlightMove()
{	
	let bool = localBoard.get(localInfo.clickedId).highlight;
	// console.log(`clickedId: ${clickedId}\nbool: ${bool	}`);
	
	if (localInfo.clickedId !== localInfo.lastClickedId)	{ clearHighlight(); }
	else								{ clearHighlight("selected"); }

	return(bool);
}

export function sendToBackend()
{
	// console.log(`lastClickedId: ${lastClickedId}\nclickedId: ${clickedId}`);
	// const clickedIsValidMove = localBoard.get(lastClickedId).targetZones.has(clickedId); //--> questo non è più un Set, probabilmente lo perdiamo durante la riassegnazione [RISOLTO]
	// NOTA - non possiamo usare una variabile in questo modo, e' meglio mettere tutto in un if in modo da controllare prima
	// che lastClickedId != null in modo che localBoard.get().etc si possa fare

	if (localInfo.lastClickedId && localInfo.lastClickedId !== localInfo.clickedId && localBoard.get(localInfo.lastClickedId).targetZones.has(localInfo.clickedId))
		requestToBack(localInfo.lastClickedId, localInfo.clickedId).then(
				function(value) {if (value) { clearHighlight(); } },
				function(value) {if (!value) { console.log("[sendToBackend]: Mossa non valida"); }}
			);
}

function updatePrice()
{
	const Piece = localBoard.get(localInfo.clickedId).piece;
	const Player = localPlayers.values().find(p => p.isPlaying === true);

	if (Piece.isBoostedBool)
		localInfo.priceSelected = "This piece is already boosted you fool!";
	else if (Piece.price > Player.nPoints)
		localInfo.priceSelected = "AHAH! You're too poor to buy that!";
	else
		localInfo.priceSelected = "Price: " + Piece.price;
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

export function setHighlighTrue(allowedMoves, flag, team)
{
	allowedMoves.forEach((highlight) => {
			localBoard.forEach(square => {
				if (square.id == highlight)
				{
					if (square.highlight === false && square.id != localInfo.clickedId)
					{
						if (square.piece?.team != team)
						{
							if (flag === "regular")
								square.highlight = true;
							else if (flag ==="boosted")
								square.boostedHighlight = true;
						}
						else if (team === "both")
						{
							if (flag === "regular")
								square.highlight = true;
							else if (flag ==="boosted")
								square.boostedHighlight = true;
						}
					}
				}
		});
	});
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

		PIECES_HIGHLIGHT[Piece.type](clickedId);
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
