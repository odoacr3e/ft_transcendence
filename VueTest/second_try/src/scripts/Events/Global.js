import { localBoard }						from "../Global/Variables.js";
import { clearHighlight, getSquareColor}	from "../Helper/render_utils.js";
import { getRootDiv }						from "../Helper/Constants.js";

let lastClickedId = null;

function globalEvents()
{
	const ROOT_DIV = getRootDiv();

	ROOT_DIV.addEventListener("click", function (event) {
		clearHighlight();
		if (event.target.localName === "img")
		{
			const clickedId = event.target.parentNode.id;
			if (lastClickedId !== null && lastClickedId !== clickedId)
				clearHighlight("point");

			const AllowedMoves = localBoard.get(clickedId).targetZones;
			AllowedMoves.forEach((highlight) => {
				localBoard.forEach(square => {
					if (square.id == highlight)
					{
						if (square.highlight === false)
						{
							square.highlight = true;
							if (square.id != clickedId && square.piece)
							{
								const DOMstyle = document.getElementById(square.id).style;
								DOMstyle.backgroundColor = "brown";
							}
						}
						else
						{
							if (square.piece && square.highlight === true)
							{
								const DOMstyle = document.getElementById(square.id).style;
								if (getSquareColor(square.id) == "white") { DOMstyle.backgroundColor = "white"; }
								else { DOMstyle.backgroundColor = "rgb(27, 0, 0)"; }
							}
							square.highlight = false;
						}
					}
				})
			})
			lastClickedId = clickedId;
		}
	});

	ROOT_DIV.addEventListener("mousedown", function (event) {
		if (event.button == 2 && event.target.localName != "img")
		{
			event.preventDefault();
			const DOMstyle = document.getElementById(event.target.id).style;
			DOMstyle.backgroundColor = "red";
			DOMstyle.borderWidth = "1px";
			DOMstyle.borderColor = "red";
		}
	});

}

export { globalEvents };