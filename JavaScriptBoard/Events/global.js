import { ROOT_DIV } from "../Helper/constants.js";
import { Board } from "../main.js";
import { clearHighlight, highlightRender } from "../Renderer/render.js";

let lastClickedId = null;

function globalEvents()
{
	ROOT_DIV.addEventListener("click", function (event) {
		if (event.target.localName === "img")
		{
			const clickedId = event.target.parentNode.id;
			if (lastClickedId !== null && lastClickedId !== clickedId)
				clearHighlight();
			
			const flatBoard = Board.flat();
			const clickedPiece = flatBoard.find((el) => el.id == clickedId).piece; 
			console.log(clickedPiece.piece_name, ` in position: ${clickedId}`);
			movePiece(clickedPiece);
			lastClickedId = clickedId;
		}
	});
}

function movePiece(piece)
{
	switch (piece.piece_name) {
		case "WHITE_PAWN":
			whitePawn(piece);
		// case "BLACK_PAWN":
			break;
		default:
			break;
	}
}


function whitePawn(piece)
{
	const curr_pos = piece.current_position;

	if (piece.moved === false) 
	{
		const AllowedMoves = [
			`${curr_pos[0]}${Number(curr_pos[1]) + 1}`,
			`${curr_pos[0]}${Number(curr_pos[1]) + 2}`,
			];
		// console.log("possible moves ", AllowedMoves);

		AllowedMoves.forEach((highlight) => {
			Board.forEach((row) => {
				row.forEach(square => {
					if (square.id == highlight)
					{
						// console.log(square);
						highlightRender(highlight, square);
					}
				})
			})
		})
	}
	else
	{
		const AllowedMoves = [`${curr_pos[0]}${Number(curr_pos[1]) + 1}`];
		console.log(AllowedMoves);
	}
}

export { globalEvents };
