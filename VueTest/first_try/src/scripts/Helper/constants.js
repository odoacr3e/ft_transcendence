import { Board } from "../Data/data.js";

function getRootDiv() {
	return document.getElementById("board");
}

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"]

const IMG_PATHS = Object.freeze ({
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

function movePiece(fromSquareId, toSquareId)
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

function clearHighlight()
{
	Board.forEach(square => {
		if (square.highlight === true)
			square.highlight = false;
	})
}

export { getRootDiv, clearHighlight, movePiece, FILES, IMG_PATHS };