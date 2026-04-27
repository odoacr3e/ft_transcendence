import { getRootDiv, clearHighlight } from "../Helper/constants.js";
import { Board } from "../Data/data.js";
import BackGround from "@/components/BackGround.vue";

let lastClickedId = null;

function globalEvents()
{
	const ROOT_DIV = getRootDiv();

	ROOT_DIV.addEventListener("click", function (event) {
		if (event.target.localName === "img" && event.button === 1)
		{
			const clickedId = event.target.parentNode.id;
			if (lastClickedId !== null && lastClickedId !== clickedId)
				clearHighlight();

			const AllowedMoves = Board.get(clickedId).targetZones;
			AllowedMoves.forEach((highlight) => {
				Board.forEach(square => {
					if (square.id == highlight)
					{
						if (square.highlight === false)
							square.highlight = true;
						else
							square.highlight = false;
					}
				})
			})
			lastClickedId = clickedId;
		}
		else if (event.button === 2)
		{
			e.preventDefault();

			const clickedId = event.target.parentNode.id;
			const elementDOM = document.getElementById(clickedId);
			const atrs = elementDOM.attributes;

			atrs.setNamedItem("background-color", "red");
		}
	});

}

export { globalEvents };






// function whitePawn(piece)
// {
// 	const curr_pos = piece.current_position;
// 	const AllowedMoves = [
// 			`${curr_pos[0]}${Number(curr_pos[1]) + 1}`,
// 			`${curr_pos[0]}${Number(curr_pos[1]) + 2}`,
// 			];

// 	if (piece.moved === false) 
// 	{
// 		AllowedMoves.forEach((highlight) => {
// 			Board.forEach((row) => {
// 				row.forEach(square => {
// 					if (square.id == highlight)
// 					{
// 						console.log(square);
// 						if (square.highlight === false)
// 							square.highlight = true;
// 						else
// 							square.highlight = false;
// 					}
// 				})
// 			})
// 		})
// 	}
// 	else
// 	{
// 		const AllowedMoves = [`${curr_pos[0]}${Number(curr_pos[1]) + 1}`];
// 		console.log(AllowedMoves);
// 	}
// }



// function movePiece(piece)
// {
// 	switch (piece.piece_name) {
// 		case "WHITE_PAWN":
// 			whitePawn(piece);
// 		// case "BLACK_PAWN":
// 			break;
// 		default:
// 			break;
// 	}
// }