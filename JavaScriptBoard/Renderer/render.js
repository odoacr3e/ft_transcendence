import * as pieces from "../Data/pieces.js";
import { ROOT_DIV } from "../Helper/constants.js";

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

// // All of this forced pieces insertions are to be removed, they are here just for debug purposes
// if (square.id[1] === '7')
// 	square.piece = pieces.blackPawn(square.id);

// if (square.id[1] === '2')
// 	square.piece = pieces.whitePawn(square.id);
function piece_filler(square)
{
	const id = square.id;

	switch (true)
	{
		case id === "e1":
			square.piece = pieces.whiteKing(id);
			break;
		case id === "d1":
			square.piece = pieces.whiteQueen(id);
			break;
		case id === "b1" || id === "g1":
			square.piece = pieces.whiteKnight(id);
			break;
		case id === "c1" || id === "f1":
			square.piece = pieces.whiteBishop(id);
			break;
		case id === "a1" || id === "h1":
			square.piece = pieces.whiteRook(id);
			break;
		case id[1] === "2":
			square.piece = pieces.whitePawn(id);
			break;
		case id === "e8":
			square.piece = pieces.blackKing(id);
			break;
		case id === "d8":
			square.piece = pieces.blackQueen(id);
			break;
		case id === "b8" || id === "g8":
			square.piece = pieces.blackKnight(id);
			break;
		case id === "c8" || id === "f8":
			square.piece = pieces.blackBishop(id);
			break;
		case id === "a8" || id === "h8":
			square.piece = pieces.blackRook(id);
			break;
		case id[1] === "7":
			square.piece = pieces.blackPawn(id);
			break;
		default:
			square.piece = null;
	}
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

export { initGamerenderer }
