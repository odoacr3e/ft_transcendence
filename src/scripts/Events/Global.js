import { movePiece, requestToBack }	from "./Movements.js";
import { clearHighlight}			from "../Helper/RenderUtils.js";
import { localBoard }				from "../Data/Variables.js";
import { getRootDiv }				from "../Helper/Constants.js";

let lastClickedId = null;
let clickedId = null;

export function globalEvents()
{
	const ROOT_DIV = getRootDiv();

	ROOT_DIV.addEventListener("click", function (event) {
		assignClickedId(event);
		highlightOnClick(event);
		sendMoveToBackend();
	});

	ROOT_DIV.addEventListener("dragstart", function (event) {
		highlightOnDrag(event);
	});

	ROOT_DIV.addEventListener("mousedown", function (event) {
		rightClickSelect(event);
	});

}

export function assignClickedId(event)
{
	if (event.target.parentNode.id !== lastClickedId)
		clearHighlight();
	else 
		clearHighlight("selected");

	if (event.target.localName === "div")
		clickedId = event.target.id;
	else
		clickedId = event.target.parentNode.id;
}

export function sendMoveToBackend()
{
	const clicksAreValid = lastClickedId !== null && lastClickedId !== null && lastClickedId !== clickedId;
	console.log(`lastClickedId: ${lastClickedId}\nclickedId: ${clickedId}`);
	const clickedIsValidMove = localBoard.get(lastClickedId).targetZones.has(clickedId); //--> questo non è più un Set ad un certo punto, probabilmente lo perdiamo durante la riassegnazione

	if (clicksAreValid && clickedIsValidMove)
		requestToBack(lastClickedId, clickedId).then(
				function(value) {if (value) { clearHighlight(); } },
				function(value) {if (!value) { console.log("[sendMoveToBackend]: Mossa non valida"); }}
			);
}

export function highlightOnClick(event)
{
		if (event.target.localName === "img")
		{
			const AllowedMoves = localBoard.get(clickedId).targetZones;

			AllowedMoves.forEach((highlight) => {
				localBoard.forEach(square => {
					if (square.id == highlight)
					{
						if (square.highlight === false && square.id != clickedId)
							square.highlight = true;
						else if (clickedId == lastClickedId && square.highlight === true)
						{
							clearHighlight("selected");
							square.highlight = false;
						}
					}
				})
			})
			lastClickedId = clickedId;
		}
}

export function highlightOnDrag(event)
{
	if (event.target.localName === "img")
	{
		const clickedId = event.target.parentNode.id;
		if (clickedId != lastClickedId)
			clearHighlight();
		
		localBoard.get(clickedId).targetZones.forEach((highlight) => {
			localBoard.forEach(square => {
				if (square.id == highlight)
					if (square.highlight === false && square.id != clickedId)
						square.highlight = true;
			})
		})
	}
}

export function rightClickSelect(event)
{
	if (event.button == 2)
	{
		event.preventDefault();
		clearHighlight("highlight");
		let targetSquare;
		if (event.target.localName === "img")
			targetSquare = localBoard.get(event.target.parentNode.id);
		else
			targetSquare = localBoard.get(event.target.id);

		if (targetSquare && !targetSquare.selected)
			targetSquare.selected = true;
		else if (targetSquare.selected)
			targetSquare.selected = false;
	}
}