import * as pieces from "../Data/pieces.js";
import { getRootDiv, INITIAL_PIECES } from "../Helper/constants.js";
import { Board } from "../Data/data.js";
/**
 * Takes an array of objects, a chessboard in this case and displays every single square according to its metadata
 * This function is called only when the game starts
 * @param {chessboard_array} data 
 */
function initGamerenderer(data) 
{
	const ROOT_DIV = getRootDiv();

	data.forEach((row) => {
		const rowEl = document.createElement("div");
		row.forEach((square) => {
			const squareDiv = document.createElement("div");
			squareDiv.id = square.id; 
			squareDiv.classList.add(square.color, "square");
			squareDiv.ondrop = (ev) => {
				ev.preventDefault();
				if (ev.currentTarget.querySelector("img"))
        			return;
				const pieceId = ev.dataTransfer.getData("pieceId");
				const formSquareId = ev.dataTransfer.getData("fromSquareId");
				const toSquareId = ev.currentTarget.id;

				console.log(formSquareId + ' => ' + toSquareId);
				
				if (!movePiece(formSquareId, toSquareId)) { return }
				
				const draggedPiece = document.getElementById(pieceId);
				if (draggedPiece)
					ev.currentTarget.appendChild(draggedPiece);
			};
			squareDiv.ondragover = (ev) => {
				ev.preventDefault();
			};

			// Questa funzione va tolta, temporanea
			// piece_filler(square);

			rowEl.appendChild(squareDiv);
		});
		rowEl.classList.add("squareRow")
		ROOT_DIV.appendChild(rowEl);
	});
	pieceRenderer(data);
}

function movePiece(fromSquareId, toSquareId)
{
	const Bflat = Board.flat();
	const fromS = Bflat.find(s => s.id == fromSquareId);
	const toS = Bflat.find(s => s.id == toSquareId);

	if (!fromS || !fromS.piece || !toS) { return false; }

	toS.piece = fromS.piece;
	fromS.piece = null;
	toS.piece.current_position = toS.id;

	return true;
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
				piece.id = `piece-${square.id}`;
				piece.draggable = true;
				piece.ondragstart = (ev) => {
					ev.dataTransfer.setData("pieceId", ev.target.id);
					ev.dataTransfer.setData("fromSquareId", ev.target.parentNode.id);
				};

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

export { initGamerenderer, highlightRender, clearHighlight, movePiece }
