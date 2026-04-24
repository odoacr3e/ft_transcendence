import { getRootDiv } from "../Helper/constants.js";
import { Board } from "../Data/data.js";
import { clearHighlight } from "../Renderer/render.js";

let lastClickedId = null;

function globalEvents()
{
	const ROOT_DIV = getRootDiv();

	ROOT_DIV.addEventListener("click", function (event) {
		if (event.target.localName === "img")
		{
			const clickedId = event.target.parentNode.id;
			if (lastClickedId !== null && lastClickedId !== clickedId)
				clearHighlight();
			
			const flatBoard = Board.flat();
			const clickedPiece = flatBoard.find((el) => el.id == clickedId).piece; 
			// console.log(clickedPiece.piece_name, ` in position: ${clickedId}`);
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
	const AllowedMoves = [
			`${curr_pos[0]}${Number(curr_pos[1]) + 1}`,
			`${curr_pos[0]}${Number(curr_pos[1]) + 2}`,
			];

	if (piece.moved === false) 
	{
		// console.log("possible moves ", AllowedMoves);

		AllowedMoves.forEach((highlight) => {
			Board.forEach((row) => {
				row.forEach(square => {
					if (square.id == highlight)
					{
						console.log(square);
						if (square.highlight === false)
							square.highlight = true;
						else
							square.highlight = false;
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
