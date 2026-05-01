import { localBoard }		from "../Global/Variables.js";
import { clearHighlight }	from "../Helper/render_utils.js";
import { updateLocalBoard } from "../Data/Game.js"

export function movePiece(fromSquareId, toSquareId)
{
	const fromS = localBoard.get(fromSquareId);
	const toS = localBoard.get(toSquareId);

	if (!fromS || !fromS.piece || !toS)
		return false;

	clearHighlight();

	toS.piece = fromS.piece;
	fromS.piece = null;
	toS.piece.current_position = toS.id;

	return true;
}

export function onDragStart(event, square)
{
  event.dataTransfer.setData('pieceId', `piece-${square.id}`)
  event.dataTransfer.setData('fromSquareId', square.id)
}

export function onDrop(event, toSquare)
{
	event.preventDefault()
	// if (toSquare.piece) { return }

	const fromSquareId = event.dataTransfer.getData('fromSquareId')

	requestToBack(fromSquareId, toSquare.id).then(
		function(value) {if (value) { clearHighlight(); }},
		function(value) {if (!value) { console.log("Mossa non valida"); }}
	);
}


export async function requestToBack(fromSquare, toSquare)
{
	try
	{
		const response = await fetch("/move.json", {
		  method: "POST",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ Request: { Operation: "Movement", From: fromSquare, To: toSquare } }),
		});
	
		if (!response.ok) throw new Error(`Impossibile caricare /move.json: ${response.status}`);
	
		const match = await response.json();
	
		if (!match || typeof match !== "object" || Array.isArray(match))
			throw new Error("Payload non valido: root deve essere un oggetto.");
	
		if (!Object.prototype.hasOwnProperty.call(match, "p1") ||
			!Object.prototype.hasOwnProperty.call(match, "p2") ||
			!Object.prototype.hasOwnProperty.call(match, "p3") ||
			!Object.prototype.hasOwnProperty.call(match, "p4") ||
			!Object.prototype.hasOwnProperty.call(match, "board"))
			throw new Error("Payload non valido: serve p1, p2, p3, p4 e board.");

		if (!match.board || typeof match.board !== "object" || Array.isArray(match.board))
			throw new Error("[validateReceivedMatch]: Payload non valido: board deve essere un oggetto.");
	
		updateLocalBoard(match);
		return true;
	}
	catch (err)
	{
		console.error(err);
		return false;
	}
}
