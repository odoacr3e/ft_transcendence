import { replaceMatchState } from "../Data/Archi.js"
import { clearHighlight }	from "../Helper/RenderUtils.js";
import { localBoard }		from "../Data/Variables.js";

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

	if (fromSquareId !== toSquare.id)
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
	
		replaceMatchState(match);
		return true;
	}
	catch (err)
	{
		console.error(err);
		return false;
	}
}
