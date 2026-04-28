import { localBoard }		from "../Global/Variables.js";
import { clearHighlight }	from "../Helper/render_utils.js";

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
	event.dataTransfer.setData('pieceId', `piece-${square.id}`);
	event.dataTransfer.setData('fromSquareId', square.id);
}

export function onDrop(event, toSquare)
{
	event.preventDefault();
	if (toSquare.piece)
		return;

	const fromSquareId = event.dataTransfer.getData('fromSquareId');
	movePiece(fromSquareId, toSquare.id);
}