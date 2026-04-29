import { movePiece } from "../Helper/constants.js";

export function onDragStart(event, square)
{
  event.dataTransfer.setData('pieceId', `piece-${square.id}`)
  event.dataTransfer.setData('fromSquareId', square.id)
}

export function onDrop(event, toSquare)
{
	event.preventDefault()
	if (toSquare.piece) { return }

	const fromSquareId = event.dataTransfer.getData('fromSquareId')
    if (!requestToBack(fromSquareId, toSquare.id)) { return }

	movePiece(fromSquareId, toSquare.id);
}

async function requestToBack(fromSquare, toSquare)
{
    const response = await fetch("/move.json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({"Request" : { "Operation": "Movement", "From" : fromSquare, "To" : toSquare }}),
    });

    if (!response.ok) { throw new Error(`Impossibile caricare /move.json: ${response.status}`); }
	const match = await response.json();

    if (!match || typeof match !== "object" || Array.isArray(match))
		throw new Error("Payload non valido: root deve essere un oggetto.");

	const hasResp = Object.prototype.hasOwnProperty.call(match, "Response");

	if (!hasResp) { throw new Error("Payload non valido: servono p1, p2, board."); }

    if (match.Response === "YAS") 
    {
        console.log("Fetch response for request, content = " + match.Response);
        return true;
    }
    return false;
}
