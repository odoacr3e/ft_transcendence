// @ts-check

const { Square } = require("../Classes/ChessBoard/chessBoard.js");

const match = require("../Classes/Match/globals.js").globals.getDebugMatch();;

/**
 * 
 * @param {String} message
 */
const ResponseError = (message) => {
	return ({ "status": "error", "message": message });
}

/**
 * 
 * @param {Object} object
 */
const ResponseSuccess = (object) => {
	return ({ "status": "success", "data": object })
}

/**
 * @param {*} result the base object from which the response json is made
 * @param {String | null} msg 
 * @param {Number | null} status 
 * @returns {{}}
 * format frontend response as an object.
 * ? means the field is optional.
 * ```ts
 * {
 *      log: 
 * 		{
 *         msg: string;
 *         status: number;
 *     	};
 *      ?board: Board;
 * 		youWin: boolean;
 *      p1: Player;
 *      p2: Player;
 *      ?p3: Player;
 *      ?p4: Player;
 * }
 * ```
 */
function responseFormatter(result, msg, status)
{
	let	log;
	let	p1 = match.white ? match.white : match.green;
	let	p2 = match.black ? match.black : match.blue;
	let	p3 = match.red;
	let	p4 = match.yellow;

	if (result && result.msg && result.status)
		log = {msg: result.msg, status: result.status};
	else
		log = {msg: msg, status: status};
	if (!log.status)
	{
		log.msg = "backend function failed for unknown reasons";
		log.status = 500;
	}
	if (!p1 || !p2)
	{
		log.msg = `cannot find p1 or p2`;
		log.status = 500;
		// @ts-ignore
		p1 = {};
		// @ts-ignore
		p2 = {};
	}
	if (!result)
		result = {};
	delete result.msg;
	delete result.status;
	if (!result.board)
		delete result.board;
	else
		modifyBoard(result.board);
	if (!p3)// @ts-ignore
		delete p3;
	if (!p4)// @ts-ignore
		delete p4;
	result.log = log;
	if (!result.youWin)
		result.youWin = false;
	if (log.status != 200)
		result.log.msg = "Game Error: " + result.log.msg;
	result.p1 = p1;
	result.p2 = p2;
	result.p3 = p3;
	result.p4 = p4;
	// delete result.p1.King;
	// delete result.p1.next;
	// delete result.p2.King;
	// delete result.p2.next;
	// delete result.p3.King;
	// delete result.p3.next;
	// delete result.p4.King;
	// delete result.p4.next;
	return (result);
}

/**
 * 
 * @param {*} board 
 */
function modifyBoard(board)
{
	for (const [pos, square] of Object.entries(board))
	{
		// @ts-ignore
		delete (square).dangerZones;
		// @ts-ignore
		if (!square.piece)
			continue ;
		square.piece.moveArray = [];
		// @ts-ignore
		delete (square).piece?.isMovedBool;
		// @ts-ignore
		delete (square).piece?.multipleMovesBool;
		// @ts-ignore
		delete (square).piece?.moveLongRangeDEBUG;
		// @ts-ignore
		delete (square).piece?.pos;
	}
}

const jsonResponse = { ResponseError, ResponseSuccess };

module.exports = { jsonResponse, responseFormatter };