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
	//la logia e' giusta ma bisogna fare un controllo ulteriore sullo square dove si sposta per sapere se
	//effettivamente se e' un movimento boostato (e serve il movimento boostato per questo lol)
	// if (localBoard.get(fromSquare).piece.useAbilityBool)
	// 	json = JSON.stringify({ type: "boost move", from: fromSquare, to: toSquare })

	let json;
	if (fromSquare === null && toSquare === null && localInfo.secondTurn)
		json = JSON.stringify({ type: "end turn", from: fromSquare, to: toSquare }) //la logica funziona e' che le risposte sono statiche
	else { json = JSON.stringify({ type: "move", from: fromSquare, to: toSquare }) }

	try
	{
		// const response = await fetch("/api/game/", {
		const response = await fetch("/move.json", {
		  method: "POST",
		  headers: { "Content-Type": "application/json" },
		  body: json,
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
