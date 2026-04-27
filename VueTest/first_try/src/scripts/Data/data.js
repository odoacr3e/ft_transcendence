import { reactive } from 'vue';
import { init } from "../Events/fetch.js";

class Square
{
	constructor(color, highlight, id, piece)
	{
        /** @type {string | "white" | "black"} */	this.color = color;
        /** @type {true | false} */                 this.highlight = highlight;
        /** @type {String} */                       this.id = id;
        /** @type {Object | null} */                this.piece = piece;
		/** @type {Set<string>} */					this.targetZones = new Set();
		/** @type {Set<string>} */					this.dangerZones = new Set();
	}
}

function getSquareColor(rowId, colIndex) {
    return (rowId + colIndex) % 2 === 0 ? "white" : "black";
}

function squareRow(rowId, board)
{
    const letters = ['a','b','c','d','e','f','g','h'];

    return letters.map((letter, index) => {
        board.set(letter + rowId, new Square(getSquareColor(rowId, index), false, letter + rowId, null));
    });
}

/**
 * @param {Set<String>} target 
 */
function fillSet(target, jsonTarget)
{
    jsonTarget.forEach(cell => {
        target.add(cell);
    });
}

/**
 * @param {Map<String, object>} board 
 * @param {Map<String, object>} jsonBoard 
 */
function fillBoard(board, jsonBoard)
{
    board.forEach(square => {
        let cell = jsonBoard.get(square.id);
        if (cell == undefined)
            throw "id non trovato in Json";
        square.piece = cell.piece;
        fillSet(square.targetZones, cell.targetZones);
        fillSet(square.dangerZones, cell.dangerZones);
    });
    return board;
}

function initMatch()
{
    const board = new Map();
    for (let i = 8; i >= 1; i--) { squareRow(i, board); }

    return fillBoard(board, matchState.board);
}


const matchState = reactive(await init())
const Board = reactive(initMatch());

export { Board };






















// /**
//  * Returns an object of given color, id and piece
//  * @param {*} color 
//  * @param {*} id 
//  * @param {*} piece 
//  * @returns 
//  */
// function Square(color, id, piece)
// {
// 	return {color, id, piece};
// }
// /**
//  * Fills a multidimensional array with squares returned by the Square function
//  * @param {integer} rowId 
//  * @returns Row of squares
//  */
// function SquareRow(rowId)
// {
// 	const squareRow = [];
// 	const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

// 	if (rowId % 2 == 0)
// 		letters.forEach((element, index) => {
// 			if(index % 2 == 0)
// 				squareRow.push(Square("white", element + rowId, null));
// 			else
// 				squareRow.push(Square("black", element + rowId, null));
// 		});
// 	else
// 		letters.forEach((element, index) => {
// 			if(index % 2 == 0)
// 				squareRow.push(Square("black", element + rowId, null));
// 			else
// 				squareRow.push(Square("white", element + rowId, null));
// 		});
// 	return (squareRow);
// }

// function initBoard()
// {
// 	return[ SquareRow(8),
// 			SquareRow(7),
// 			SquareRow(6),
// 			SquareRow(5),
// 			SquareRow(4),
// 			SquareRow(3),
// 			SquareRow(2),
// 			SquareRow(1) ];
// }

// export {initBoard};