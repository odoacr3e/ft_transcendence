function getRootDiv() {
	return document.getElementById("board");
}

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"]

const IMG_PATHS = Object.freeze ({
	"whiteKing" : "../../assets/pieces/white/King.png",
	"whiteChampion" : "../../assets/pieces/white/Queen.png",
	"whiteJester" : "../../assets/pieces/white/Knight.png",
	"whiteValkirya" : "../../assets/pieces/white/Bishop.png",
	"whiteMinotaurus" : "../../assets/pieces/white/Rook.png",
	"whitePawn" : "../../assets/pieces/white/Pawn.png",
	"blackKing" : "../../assets/pieces/black/King.png",
	"blackChampion" : "../../assets/pieces/black/Queen.png",
	"blackJester" : "../../assets/pieces/black/Knight.png",
	"blackValkirya" : "../../assets/pieces/black/Bishop.png",
	"blackMinotaurus" : "../../assets/pieces/black/Rook.png",
	"blackPawn" : "../../assets/pieces/black/Pawn.png"
});

export { getRootDiv, IMG_PATHS, FILES };