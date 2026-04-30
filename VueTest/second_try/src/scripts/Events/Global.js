import { localBoard }		from "../Global/Variables.js";
import { clearHighlight}	from "../Helper/render_utils.js";
import { getRootDiv }		from "../Helper/Constants.js";
import { movePiece } 		from "./Movements.js";

let lastClickedId = null;

export function globalEvents()
{
	const ROOT_DIV = getRootDiv();

	ROOT_DIV.addEventListener("click", function (event) {
		if (event.target.parentNode.id !== lastClickedId)
			clearHighlight();
		else
			clearHighlight("selected");
		const clickedId = event.target.parentNode.id;
		if (clickedId != null && lastClickedId != null && lastClickedId != clickedId)
		{
			console.log(`lastClickedId: ${lastClickedId} && clickedId: ${clickedId}`);
			
			if (localBoard.get(lastClickedId).piece != null)
				movePiece(lastClickedId, clickedId);
		}
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