import { ROOT_DIV } from "../Helper/constants.js";
import { Board } from "../main.js";
import { clearHighlight, highlightRender } from "../Renderer/render.js";

function globalEvents()
{
	ROOT_DIV.addEventListener("click", function (event) {
		if (event.target.localName === "img")
		{
			const clickedId = event.target.parentNode.id;
			// console.log(clickedId);
			// console.log(Board);
			const flatBoard = Board.flat();
			// console.log(flatBoard);
			const clickedPiece = flatBoard.find((el) => el.id == clickedId).piece; 
			console.log(clickedPiece.piece_name, ` in position: ${clickedId}`);
			movePiece(clickedPiece);
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
	clearHighlight(Board);
	const curr_pos = piece.current_position;
	const flatBoard = Board.flat();

	if (piece.moved === false) 
	{
		const AllowedMoves = [
			`${curr_pos[0]}${Number(curr_pos[1]) + 1}`,
			`${curr_pos[0]}${Number(curr_pos[1]) + 2}`,
			];
		console.log("possible moves ", AllowedMoves);

		AllowedMoves.forEach((highlight) => {
			Board.forEach((row) => {
				row.forEach(square => {
					if (square.id == highlight)
					{
						square.highlight = true;
						console.log(square);
						highlightRender(highlight);
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
