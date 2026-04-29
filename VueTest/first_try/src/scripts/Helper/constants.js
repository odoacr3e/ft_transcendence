import { Board } from "../Data/data.js";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"]

export const IMG_PATHS = Object.freeze ({
	"whiteKing" : new URL("../../assets/pieces/white/king.png", import.meta.url).href,
	"whiteChampion" : new URL("../../assets/pieces/white/queen.png", import.meta.url).href,
	"whiteJester" : new URL("../../assets/pieces/white/knight.png", import.meta.url).href,
	"whiteValkirya" : new URL("../../assets/pieces/white/bishop.png", import.meta.url).href,
	"whiteMinotaurus" : new URL("../../assets/pieces/white/rook.png", import.meta.url).href,
	"whiteBastards" : new URL("../../assets/pieces/white/pawn.png", import.meta.url).href,
	"blackKing" : new URL("../../assets/pieces/black/king.png", import.meta.url).href,
	"blackChampion" : new URL("../../assets/pieces/black/queen.png", import.meta.url).href,
	"blackJester" : new URL("../../assets/pieces/black/knight.png", import.meta.url).href,
	"blackValkirya" : new URL("../../assets/pieces/black/bishop.png", import.meta.url).href,
	"blackMinotaurus" : new URL("../../assets/pieces/black/rook.png", import.meta.url).href,
	"blackBastards" : new URL("../../assets/pieces/black/pawn.png", import.meta.url).href
});

export function getRootDiv()
{
	return document.getElementById("board");
}

export function clearHighlight(flag)
{
	Board.forEach(square => {
		if (square.highlight === true && (flag === "point" || flag === undefined))
			square.highlight = false;
		const style = document.getElementById(square.id).style;
		if (style.backgroundColor == "brown" && (flag === "square" || flag === undefined))
		{
			if (square.color == "white") { style.backgroundColor = "white"; style.borderWidth = "0"; style.borderColor = "trasparent"; }
			else { style.backgroundColor = "rgb(27, 0, 0)"; style.borderWidth = "0"; style.borderColor = "trasparent"; }
		}
	})
}

export function movePiece(fromSquareId, toSquareId)
{
	const fromS = Board.get(fromSquareId);
	const toS = Board.get(toSquareId);

	if (!fromS || !fromS.piece || !toS) { return false; }

	clearHighlight();

	toS.piece = fromS.piece;
	fromS.piece = null;
	toS.piece.current_position = toS.id;

	return true;
}

export function boardConverter(Board)
{
	const DBoard = [];

	for (let rank = 8; rank >= 1; rank -= 1)
	{
		const row = [];
		for (const file of FILES)
			row.push(Board.get(`${file}${rank}`));
		DBoard.push(row);
	}
	return DBoard;
}
