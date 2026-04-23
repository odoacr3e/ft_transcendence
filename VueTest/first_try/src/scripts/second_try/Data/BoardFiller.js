import { reactive } from "vue";
import {TEAM, Square, Piece} from "./Classes.js"; //Qui ho pensato di creare delle classi ereditarie di piece per i vari Pawn, Knights ecc...

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

function getSquareColor(rank, fileIndex) {
  return (rank + fileIndex) % 2 === 0 ? "white" : "black";
}

function makeSquareId(file, rank) {
  return `${file}${rank}`;
}

function placePiece(board, squareId, piece)
{
	const square = board.get(squareId);
	if (!square) 
		throw new Error(`Square inesistente: ${squareId}`);
	square.setPiece(piece);
}

function initVoidBoard() 
{
	const board = new Map();

	for (let rank = 8; rank >= 1; rank -= 1) 
	{
	    for (let i = 0; i < FILES.length; i += 1)
		{
	    	const file = FILES[i];
	    	const id = makeSquareId(file, rank);
	    	const color = getSquareColor(rank, i);
	    	board.set(id, new Square(id, color, null));
	    }
	}
	return board;
}

function initPieces(board) 
{
	placePiece(board, "a1", new Piece(TEAM.BLACK, "a1"));
}

function initBoard()
{
  const board = initVoidBoard();
  initPieces(board);
  return board;
}

const Board = reactive(initBoard());

/** A quanto pare vue è una merda e non accetta di displayare una mappa ma ha bisogno di un array di array
 * Questo chiarisce molto perchè l'indiano abbia usato un array di array
 * Adapter per Vue: converte Map -> Array<Array<Square>>
 * Ordine: rank 8 -> 1, file a -> h
 */
function boardConverter(boardMap = Board)
{
	const rows = [];

	for (let rank = 8; rank >= 1; rank -= 1)
	{
	    const row = [];
	    for (const file of FILES)
			row.push(boardMap.get(`${file}${rank}`));
	    rows.push(row);
	}
	return rows;
}

export { Board, initBoard, boardConverter };