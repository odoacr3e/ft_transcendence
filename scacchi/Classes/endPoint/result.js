//@ts-check
const move = require("../../Macro/enums").enumSpecialMoves;
const {copyBoard} = require("../ChessBoard/chessBoard.js")

/** @typedef {import('../../Classes/ChessBoard/chessBoard.js').Square} Square */
/** @typedef {Map<String, Square>} Board */

//SECTION - contents
//	class Result
//	Board manipulation
//	game error management utils

class bitMaskMoves
{
	constructor()
	{
		this._mask = 0;
	}
	SetCastling(){this._mask |= move.CASTLING};
	CheckCastling(){return (this._mask & move.CASTLING)};
	SetTransfiguration(){this._mask |= move.TRANSFIGURATION};
	CheckTransfiguration(){return (this._mask & move.TRANSFIGURATION)};
}

//SECTION - class Result

class Result
{
	/**
	 * 
	 * @param {Result | null} other
	 */
	constructor (other=null)
	{
		/** @type {Number | null} */this.status = 200;
		/** @type {string | null} */this.msg = "OK";
		/** @type {Board | null} */	this.board = null;
		/** @type {boolean} */		this.youWin = false;
									this.usedBoost = false;
									this.specialMoves = new bitMaskMoves();
		
		if (!other)
			return ;
		this.status = other.status;
		this.msg = other.msg;
		if (other.board)
			this.board = copyBoard(other.board, this.board);
	}
	Success(msg="OK")
	{
		this.status = 200;
		this.msg = msg;
		return (true);
	}
	Error(msg="Backend failed for unknown reasons", status=500)
	{
		this.status = status;
		this.msg = msg;
		return (false);
	}
}

module.exports = {Result};