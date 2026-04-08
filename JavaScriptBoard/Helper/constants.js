import * as pieces from "../Data/pieces.js";

const ROOT_DIV = document.getElementById("board");

const INITIAL_PIECES = {
	"e1": pieces.whiteKing,
	"d1": pieces.whiteQueen,
	"b1": pieces.whiteKnight,
	"g1": pieces.whiteKnight,
	"c1": pieces.whiteBishop,
	"f1": pieces.whiteBishop,
	"a1": pieces.whiteRook,
	"h1": pieces.whiteRook,
	"e8": pieces.blackKing,
	"d8": pieces.blackQueen,
	"b8": pieces.blackKnight,
	"g8": pieces.blackKnight,
	"c8": pieces.blackBishop,
	"f8": pieces.blackBishop,
	"a8": pieces.blackRook,
	"h8": pieces.blackRook
};

export { ROOT_DIV, INITIAL_PIECES };