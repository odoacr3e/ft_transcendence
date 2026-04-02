export function Greet()
{
	alert("Sei un gay!");
}

// Obtain square color by rowId and column index
function getSquareColor(rowId, colIndex) {
    return (rowId + colIndex) % 2 === 0 ? "white" : "black";
}

/**
 * Square factory function 
 * @param {string} color
 * @param {string} id
 * @param {} piece 
 * @returns Object Square containing color, id, and piece on the square
 */
function Square(color, id, piece) {
    return { color, id, piece };
}

/**
 * Creates a chessboard row using rowId index
 * @param {integer} rowId 
 * @returns A single chessboard Row
 */
function SquareRow(rowId) 
{
    const letters = ['a','b','c','d','e','f','g','h'];

    return letters.map((letter, index) => {
        const color = getSquareColor(rowId, index);
        const id = letter + rowId;
        return Square(color, id, null);
    });
}

/**
 * 
 * @returns Board filled with SquareRows
 */
function initBoard() 
{
    const board = [];

    for (let i = 8; i >= 1; i--)
        board.push(SquareRow(i));

    return board;
}

export { initBoard };






















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