import { localBoard, localInfo }	from "@/scripts/Data/Variables";
import { updateMatchState }			from "@/scripts/Data/Archi"
import { clearHighlight }			from "@/scripts/Helper/RenderUtils";

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

	if (fromSquareId !== toSquare.id && localBoard.get(toSquare.id).highlight)
		requestToBack(fromSquareId, toSquare.id).then(
			function(value) {if (value) { clearHighlight(); }},
			function(value) {if (!value) { console.log("Mossa non valida"); }}
		);
}

export async function requestToBack(fromSquare, toSquare)
{
	let type, url;

	if (fromSquare === null && toSquare === null && localInfo.secondTurn)
		{type = "endTurn"; url = "move.json" }	
	else if (fromSquare && toSquare === null)
		{type = "boost"; url = "move.json" }	
	else {type = "move"; url = "move.json" }	

	try
	{
		const response = await fetch(url, {
		  method: "POST",
		  headers: { "Content-Type": "application/json" },
		  body: JSON.stringify({ type: type, from: fromSquare, to: toSquare }),
		});
	
		if (!response.ok) throw new Error(`Impossibile caricare /move.json: ${response.status}`);
	
		const match = await response.json();
	
		updateMatchState(match);
		return true;
	}
	catch (err)
	{
		console.error(err);
		return false;
	}
}
