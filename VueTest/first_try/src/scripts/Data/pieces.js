function blackKing(current_position)
{
	return {
		current_position,
		//movements,
		img: new URL("../../assets/pieces/black/king.png", import.meta.url).href,
		piece_name: "BLACK_KING"
	};
}

function blackQueen(current_position)
{
	return {
		current_position,
		//movements,
		img: new URL("../../assets/pieces/black/queen.png", import.meta.url).href,
		piece_name: "BLACK_QUEEN"
	};
}

function blackKnight(current_position)
{
	return {
		current_position,
		//movements,
		img: new URL("../../assets/pieces/black/knight.png", import.meta.url).href,
		piece_name: "BLACK_KNIGHT"
	};
}

function blackBishop(current_position)
{
	return {
		current_position,
		//movements,
		img: new URL("../../assets/pieces/black/bishop.png", import.meta.url).href,
		piece_name: "BLACK_BISHOP"
	};
}

function blackRook(current_position)
{
	return {
		current_position,
		//movements,
		img: new URL("../../assets/pieces/black/rook.png", import.meta.url).href,
		piece_name: "BLACK_ROOK"
	};
}

function blackPawn(current_position)
{
	return {
		current_position,
		//movements,
		img: new URL("../../assets/pieces/black/pawn.png", import.meta.url).href,
		piece_name: "BLACK_PAWN",
		moved: false
	};
}

function whiteKing(current_position)
{
	return {
		current_position,
		//movements,
		img: new URL("../../assets/pieces/white/king.png", import.meta.url).href,
		piece_name: "WHITE_KING"
	};
}

function whiteQueen(current_position)
{
	return {
		current_position,
		//movements,
		img: new URL("../../assets/pieces/white/queen.png", import.meta.url).href,
		piece_name: "WHITE_QUEEN"
	};
}

function whiteKnight(current_position)
{
	return {
		current_position,
		//movements,
		img: new URL("../../assets/pieces/white/knight.png", import.meta.url).href,
		piece_name: "WHITE_KNIGHT"
	};
}

function whiteBishop(current_position)
{
	return {
		current_position,
		//movements,
		img: new URL("../../assets/pieces/white/bishop.png", import.meta.url).href,
		piece_name: "WHITE_BISHOP"
	};
}

function whiteRook(current_position)
{
	return {
		current_position,
		//movements,
		img: new URL("../../assets/pieces/white/rook.png", import.meta.url).href,
		piece_name: "WHITE_ROOK"
	};
}

function whitePawn(current_position)
{
	return {
		current_position,
		//movements,
		img: new URL("../../assets/pieces/white/pawn.png", import.meta.url).href,
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