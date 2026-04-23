export const TEAM = Object.freeze({
  WHITE: "WHITE",
  BLACK: "BLACK",
});

export const PIECE_TYPE = Object.freeze({
  PAWN: "PAWN",
  KNIGHT: "KNIGHT",
  BISHOP: "BISHOP",
  ROOK: "ROOK",
  QUEEN: "QUEEN",
  KING: "KING",
});

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

export function isValidSquareId(id)
{
	if (typeof id !== "string" || id.length !== 2) return false;
	const file = id[0];
	const rank = Number(id[1]);
	return (FILES.includes(file) && rank >= 1 && rank <= 8);
}

export function offsetSquare(id, dx, dy)
{
	const file = id[0];
	const rank = Number(id[1]);

	const x = FILES.indexOf(file);
	const y = rank - 1;

	const ox = x + dx;
	const oy = y + dy;

	if (ox < 0 || ox > 7 || oy < 0 || oy > 7)
		return null;

	return (`${FILES[ox]}${oy + 1}`);
}

export class Square 
{
	constructor(id, color, piece = null) 
	{
		if (!isValidSquareId(id)) throw new Error(`Square id non valido: ${id}`);
		if (color !== "white" && color !== "black")
			throw new Error(`Colore square non valido: ${color}`);

		this.id = id;
		this.color = color;
		this.piece = null;

		// Metadati di dominio (non UI)
		this.targetZones = new Set();
		this.dangerZones = new Set();

		if (piece !== null) this.setPiece(piece);
	}

	isEmpty(){
		return (this.piece === null);
	}

	setPiece(piece) 
	{
		if (!(piece instanceof Piece)) {
			throw new Error("Square.setPiece accetta solo istanze di Piece");
		}
		this.piece = piece;
		piece.setPosition(this.id);
	}

	removePiece() 
  	{
		const removed = this.piece;
		this.piece = null;
		return removed;
	}
}

export class Piece 
{
	constructor({ type, team, pos, value = 0, longRange = false }) 
	{
		if (!Object.values(PIECE_TYPE).includes(type)) {
			throw new Error(`Tipo pezzo non valido: ${type}`);
		}
		if (!Object.values(TEAM).includes(team)) {
			throw new Error(`Team non valido: ${team}`);
		}
		if (!isValidSquareId(pos)) {
		  throw new Error(`Posizione non valida: ${pos}`);
		}

		this.type = type;
		this.team = team;
		this.pos = pos;
		this.value = value;
		this.longRange = longRange;

		this.isMoved = false;
		this.isBoosted = false;
	}

	setPosition(nextPos) 
	{
		if (!isValidSquareId(nextPos)) {
		  throw new Error(`Posizione non valida: ${nextPos}`);
		}
		this.pos = nextPos;
  	}

  	markMoved() {
		this.isMoved = true;
  	}

	// Queste vanno messe nelle classi sotto, tanto qui i metodi di 
	// classe puoi riscriverli come minchia vuoi, overload a mille
	getLegalMoves(_boardMap) {
		throw new Error("Metodo astratto: implementalo nella classe derivata");
	}
}