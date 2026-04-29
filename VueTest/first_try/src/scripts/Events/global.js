import { getRootDiv, clearHighlight } from "../Helper/constants.js";
import { Board } from "../Data/data.js";

let lastClickedId = null;

function globalEvents()
{
	const ROOT_DIV = getRootDiv();

	ROOT_DIV.addEventListener("click", function (event) {
		clearHighlight("square");
		if (event.target.localName === "img")
		{
			const clickedId = event.target.parentNode.id;
			if (lastClickedId !== null && lastClickedId !== clickedId)
				clearHighlight("point");

			const AllowedMoves = Board.get(clickedId).targetZones;
			AllowedMoves.forEach((highlight) => {
				Board.forEach(square => {
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
								if (square.color == "white") { DOMstyle.backgroundColor = "white"; }
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
			DOMstyle.backgroundColor = "brown";
			DOMstyle.borderWidth = "1px";
			DOMstyle.borderColor = "red";
		}
	});

}

export { globalEvents };