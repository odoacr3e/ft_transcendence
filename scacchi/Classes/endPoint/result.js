//@ts-check
import { enumSpecialMoves as move } from "../../Macro/enums.js";
import {copyBoard} from "../ChessBoard/chessBoard.js";

/** @typedef {import('../../Classes/ChessBoard/chessBoard.js').Square} Square */
/** @typedef {import('../../Classes/Match/match.js').Match} Match */
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
	SetEndGame(){this._mask |= move.ENDGAME};
	CheckEndGame(){return (this._mask & move.ENDGAME)};
	SetKingDanger(){this._mask |= move.CHECK};
	CheckKingDanger(){return (this._mask & move.CHECK)};
	SetCheckMate(){this._mask |= (move.CHECKMATE | move.ENDGAME)};
	CheckKingCheck(){return (this._mask & move.CHECKMATE)};
	SetSniperMove(){this._mask |= (move.SNIPER)};
	CheckSniperMove(){return (this._mask & move.SNIPER)};
	SetBastardMove(){return (this._mask |= move.ISBASTARD)};
	CheckBastardMove(){return (this._mask & move.ISBASTARD)};
	SetEatenBastard(){return (this._mask |= move.EATENBASTARD)};
	CheckEatenBastard(){return (this._mask & move.EATENBASTARD)};
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
		/**	@type {*} */			this.log = {}; 
		/** @type {Board | null} */	this.board = null;
		/** @type {boolean} */		this.youWin = false;
									this.usedBoost = false;
									this.specialMoves = new bitMaskMoves();
		/** @type {Match | null} */	this.match = null;

		if (!other)
			return ;
		this.status = other.status;
		this.msg = other.msg;
		if (other.match)
			this.match = other.match;
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

export {Result};