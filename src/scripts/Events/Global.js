import { localBoard, localPlayers }	from "../Data/Variables.js";
import { PIECES_HIGHLIGHT }			from "../Helper/piecesHighlits.js";
import { requestToBack }			from "./Movements.js";
import { clearHighlight}			from "../Helper/RenderUtils.js";
import { getRootDiv }				from "../Helper/Constants.js";

let lastClickedId = null;
let clickedId = null;

export function useAbility()
{
	if (localBoard.get(clickedId).piece.useAbilityBool)
		localBoard.get(clickedId).piece.useAbilityBool = false;
	else { localBoard.get(clickedId).piece.useAbilityBool = true; }

	PIECES_HIGHLIGHT[localBoard.get(clickedId).piece.type](clickedId);
}

export function checkPermision(event)
{
	if (event.target.localName === "div")	{ clickedId = event.target.id; }
	else									{ clickedId = event.target.parentNode.id; }
	
	if (clickedId === "" || clickedId === "board") { return (false) }; //dragging multiplo strano

	const Piece = localBoard.get(clickedId).piece;
	const Player = localPlayers.values().find(p => p.isPlaying === true);
	 	
	if (Piece && Piece.team != Player.team) { lastClickedId = null; return false; }

	return true;
}

export function globalEvents()
{
	const ROOT_DIV = getRootDiv();

	ROOT_DIV.addEventListener("click", function (event) {
		if (!checkPermision(event))			{ clearHighlight(); return; }
		if (checkForHighlightMove(event))	{ sendToBackend(); }
		else 								{ highlightOnClick(event); }
	});

	ROOT_DIV.addEventListener("dragstart", function (event) {
		highlightOnDrag(event);
	});

	ROOT_DIV.addEventListener("mousedown", function (event) {
		rightClickSelect(event);
	});

}

export function checkForHighlightMove(event)
{	
	let bool = localBoard.get(clickedId).highlight;
	// console.log(`clickedId: ${clickedId}\nbool: ${bool	}`);
	
	if (clickedId !== lastClickedId)	{ clearHighlight(); }
	else								{ clearHighlight("selected"); }

	return(bool);
}

export function sendToBackend()
{
	// console.log(`lastClickedId: ${lastClickedId}\nclickedId: ${clickedId}`);
	// const clickedIsValidMove = localBoard.get(lastClickedId).targetZones.has(clickedId); //--> questo non è più un Set, probabilmente lo perdiamo durante la riassegnazione [RISOLTO]
	// NOTA - non possiamo usare una variabile in questo modo, e' meglio mettere tutto in un if in modo da controllare prima
	// che lastClickedId != null in modo che localBoard.get().etc si possa fare

	if (lastClickedId && lastClickedId !== clickedId && localBoard.get(lastClickedId).targetZones.has(clickedId))
		requestToBack(lastClickedId, clickedId).then(
				function(value) {if (value) { clearHighlight(); } },
				function(value) {if (!value) { console.log("[sendToBackend]: Mossa non valida"); }}
			);
}

export function highlightOnClick(event)
{
	if (event.target.localName === "img")
	{
		if (clickedId === lastClickedId) 
		{
			clearHighlight();
			lastClickedId = null;
			return;
		}
		const piece = localBoard.get(clickedId).piece.type;
		PIECES_HIGHLIGHT[piece](clickedId);
		lastClickedId = clickedId;
	}
	else
		lastClickedId = null;
			
}

export function setHighlighTrue(allowedMoves, flag, team)
{
	allowedMoves.forEach((highlight) => {
			localBoard.forEach(square => {
				if (square.id == highlight)
				{
					if (square.highlight === false && square.id != clickedId)
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
		if (clickedId != lastClickedId)
			clearHighlight();

		const Piece = localBoard.get(clickedId).piece;
		const Player = localPlayers.values().find(p => p.isPlaying === true);
	 	
		if (Piece.team != Player.team) { return; }

		PIECES_HIGHLIGHT[Piece.type](clickedId);
	}
}

export function rightClickSelect(event)
{
	if (event.button == 2)
	{
		event.preventDefault();
		clearHighlight("highlight");
		lastClickedId = null;
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
