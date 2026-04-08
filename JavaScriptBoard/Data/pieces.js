function blackKing(current_position)
{
	return {
		current_position,
		img: "Assets/pieces/black/king.png",
		piece_name: "BLACK_KING"
	};
}

function blackQueen(current_position)
{
	return {
		current_position,
		img: "Assets/pieces/black/queen.png",
		piece_name: "BLACK_QUEEN"
	};
}

function blackKnight(current_position)
{
	return {
		current_position,
		img: "Assets/pieces/black/knight.png",
		piece_name: "BLACK_KNIGHT"
	};
}

function blackBishop(current_position)
{
	return {
		current_position,
		img: "Assets/pieces/black/bishop.png",
		piece_name: "BLACK_BISHOP"
	};
}

function blackRook(current_position)
{
	return {
		current_position,
		img: "Assets/pieces/black/rook.png",
		piece_name: "BLACK_ROOK"
	};
}

function blackPawn(current_position)
{
	return {
		current_position,
		img: "Assets/pieces/black/pawn.png",
		piece_name: "BLACK_PAWN",
		moved: false
	};
}

function whiteKing(current_position)
{
	return {
		current_position,
		img: "Assets/pieces/white/king.png",
		piece_name: "WHITE_KING"
	};
}

function whiteQueen(current_position)
{
	return {
		current_position,
		img: "Assets/pieces/white/queen.png",
		piece_name: "WHITE_QUEEN"
	};
}

function whiteKnight(current_position)
{
	return {
		current_position,
		img: "Assets/pieces/white/knight.png",
		piece_name: "WHITE_KNIGHT"
	};
}

function whiteBishop(current_position)
{
	return {
		current_position,
		img: "Assets/pieces/white/bishop.png",
		piece_name: "WHITE_BISHOP"
	};
}

function whiteRook(current_position)
{
	return {
		current_position,
		img: "Assets/pieces/white/rook.png",
		piece_name: "WHITE_ROOK"
	};
}

function whitePawn(current_position)
{
	return {
		current_position,
		img: "Assets/pieces/white/pawn.png",
		piece_name: "WHITE_PAWN",
		moved: false
	};
}


export 
{
	blackKing,
	blackQueen,
	blackKnight,
	blackBishop,
	blackRook,
	blackPawn,
	whiteKing,
	whiteQueen,
	whiteKnight,
	whiteBishop,
	whiteRook,
	whitePawn
};