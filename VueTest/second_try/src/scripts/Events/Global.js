import { getRootDiv } from "../Helper/Constants.js";
import { clearHighlight } from "../Helper/render_utils.js";
import { localBoard } from "../Global/Variables.js";

let lastClickedId = null;

function globalEvents()
{
	const ROOT_DIV = getRootDiv();

	ROOT_DIV.addEventListener("click", function (event) {
		if (event.target.localName === "img" && event.button === 0)
		{
			const clickedId = event.target.parentNode.id;
			if (lastClickedId !== null && lastClickedId !== clickedId)
				clearHighlight();

			const AllowedMoves = localBoard.get(clickedId).targetZones;
			AllowedMoves.forEach((highlightId) => {
				const targetSquare = localBoard.get(highlightId);
				if (targetSquare)
					targetSquare.highlight = !targetSquare.highlight
			})
			lastClickedId = clickedId;
		}
		else if (event.button === 2)
		{
			event.preventDefault();

			const clickedId = event.target.parentNode.id;
			const elementDOM = document.getElementById(clickedId);

			elementDOM.style.backgroundColor = "red"
		}
	});

}

export { globalEvents };