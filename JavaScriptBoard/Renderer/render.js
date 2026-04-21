import * as pieces from "../Data/pieces.js";
import { ROOT_DIV } from "../Helper/constants.js";
import { INITIAL_PIECES } from "../Helper/constants.js"
import { Board } from "../main.js";
/**
 * Takes an array of objects, a chessboard in this case and displays every single square according to its metadata
 * This function is called only when the game starts
 * @param {chessboard_array} data 
 */
function initGamerenderer(data) 
{
	data.forEach((row) => {
		const rowEl = document.createElement("div");
		row.forEach((square) => {
			const squareDiv = document.createElement("div");
			squareDiv.id = square.id; 
			squareDiv.classList.add(square.color, "square");

			// Questa funzione va tolta, temporanea
			piece_filler(square);

			rowEl.appendChild(squareDiv);
		});
		rowEl.classList.add("squareRow")
		ROOT_DIV.appendChild(rowEl);
	});
	pieceRenderer(data);
}

function piece_filler(square)
{
	const id = square.id;

	if (INITIAL_PIECES[id])
		square.piece = INITIAL_PIECES[id](id);
	else if (id[1] === "2")
		square.piece = pieces.whitePawn(id);
	else if (id[1] === "7")
		square.piece = pieces.blackPawn(id);
	else
		square.piece = null;
}

function pieceRenderer(data)
{
	data.forEach(row => {
		row.forEach(square => {
			if (square.piece) 
			{
				const squareEl = document.getElementById(square.id);
				const piece = document.createElement("img");

				piece.src = square.piece.img;

				piece.classList.add("piece");
				squareEl.appendChild(piece);
			}
		});
	});
}

function highlightRender(squareId, square)
{
	const DOMsquare = document.getElementById(squareId);
	if (square.highlight === false)
	{
		square.highlight = true;
		const highlightSpan = document.createElement("span");
		highlightSpan.classList.add("highlight");
		DOMsquare.appendChild(highlightSpan);
	}
	else
	{
		square.highlight = false;
		DOMsquare.removeChild(DOMsquare.querySelector(".highlight"));
	}
}

function clearHighlight()
{
	Board.forEach(row => {
		row.forEach(square => {
			const DOMsquare = document.getElementById(square.id);
			if (square.highlight === true)
			{
				square.highlight = false;
				DOMsquare.removeChild(DOMsquare.querySelector(".highlight"));
			}
		})
	})
}

export { initGamerenderer, highlightRender, clearHighlight }
