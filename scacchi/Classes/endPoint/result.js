/** @typedef {Map<String, Square>} Board */

//SECTION - contents
//	class Result
//	Board manipulation
//	game error management utils

//SECTION - class Result

class Result
{
	/**
	 * 
	 * @param {Result | null} other
	 */
	constructor (other=null)
	{
		/** @type {Number | null} */this.status = null;
		/** @type {string | null} */this.msg = "OK";
		/** @type {Board | null} */	this.board = null;
		/** @type {boolean} */		this.youWin = false;
									this.usedBoost = false;
		
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