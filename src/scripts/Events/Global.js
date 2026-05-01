import { movePiece, requestToBack }	from "./Movements.js";
import { clearHighlight}			from "../Helper/RenderUtils.js";
import { localBoard }				from "../Data/Variables.js";
import { getRootDiv }				from "../Helper/Constants.js";

let lastClickedId = null;

export function globalEvents()
{
	const ROOT_DIV = getRootDiv();

	ROOT_DIV.addEventListener("click", function (event) {
		if (event.target.parentNode.id !== lastClickedId)
			clearHighlight();
		else { clearHighlight("selected"); }
		
		let clickedId;
		if (event.target.localName === "div")
			clickedId = event.target.id;
		else { clickedId = event.target.parentNode.id; }


		if (lastClickedId !== null && lastClickedId !== clickedId && localBoard.get(lastClickedId).targetZones.has(clickedId))
			requestToBack(lastClickedId, clickedId).then(
					function(value) {if (value) { clearHighlight(); } },
					function(value) {if (!value) { console.log("Mossa non valida"); }}
				);

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
	});

	ROOT_DIV.addEventListener("dragstart", function (event) {
		if (event.target.localName === "img")
		{
			const clickedId = event.target.parentNode.id;

			localBoard.get(clickedId).targetZones.forEach((highlight) => {
				localBoard.forEach(square => {
					if (square.id == highlight)
						if (square.highlight === false && square.id != clickedId)
							square.highlight = true;
				})
			})
		}
	});

	ROOT_DIV.addEventListener("mousedown", function (event) {
		if (event.button == 2)
		{
			event.preventDefault();
			clearHighlight("highlight");
			let targetSquare;
			if (event.target.localName === "img") { targetSquare = localBoard.get(event.target.parentNode.id); }
			else { targetSquare = localBoard.get(event.target.id); }

			if (targetSquare && !targetSquare.selected) { targetSquare.selected = true; }
			else if (targetSquare.selected) { targetSquare.selected = false; }
		}
	});

}