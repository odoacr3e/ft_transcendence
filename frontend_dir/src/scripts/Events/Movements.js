import { localBoard, localInfo }	from "@/scripts/Data/Variables";
import { clearHighlight }			from "@/scripts/Events/utils/HighlightUtils.js";
import { sendToBackend }			from "./BackLink.js";
import { PIECES_ABILITY } 			from "@/scripts/Helper/abilityMovement";

export function onDragStart(event, square)
{
	event.dataTransfer.setData('pieceId', `piece-${square.id}`)
	event.dataTransfer.setData('fromSquareId', square.id)

	event.dataTransfer.setDragImage(event.target, window.outerWidth, window.outerHeight);

	document.querySelectorAll("#floatingPiece").forEach(node => node.remove());

  	localInfo.dragClone = event.target.cloneNode(true);
	localInfo.dragClone.id = "floatingPiece";
	localInfo.dragClone.style.top = -200 + "px";
	localInfo.dragClone.style.left = -200 + 'px';
  	localInfo.dragClone.style.position = 'fixed';
  	localInfo.dragClone.style.pointerEvents = 'none';
  	localInfo.dragClone.style.zIndex = '13';
  	localInfo.dragClone.style.width = event.target.offsetWidth + 'px';
  	localInfo.dragClone.style.height = event.target.offsetHeight + 'px';
  	document.body.appendChild(localInfo.dragClone);

	//FIXME - DOBBIAMO ASSICURARCI CHE QUESTO NON ROMPA NULLA
	localInfo.lastClickedId = event.target.parentNode.id;

  	setTimeout(() => { event.target.style.visibility = 'hidden'; }, 0);
}

export async function onDrop(event, toSquare)
{
	event.preventDefault();

	const fromSquareId	= event.dataTransfer.getData('fromSquareId');
	const toSquareId	= toSquare.id;
	
	// console.log("[onDrop]: Entrato in onDrop!");
	
	const isAbilityMove	= localBoard.get(fromSquareId).useAbilityBool || localInfo.secondMove;
	if (isAbilityMove)
	{
		// console.log("[onDrop]: Entrato nell'if delle abilità");
		await PIECES_ABILITY[localInfo.usingAbility](fromSquareId, toSquareId, "");
		return;
	}

	const isValidMove = fromSquareId !== toSquareId && localBoard.get(toSquareId).highlight;
	if (!isValidMove)
	{
		console.log("[onDrop]: mossa non valida!");
		return
	}

	localInfo.dropDone = true;

	const moveAccepted = await sendToBackend(fromSquareId, toSquareId, true);
	if (moveAccepted)
	{
		// console.log("[onDrop]: Mossa valida!");	
		clearHighlight();
		localInfo.usingAbility = "";
	}
	else
	{
		localInfo.dropDone = false;
		// console.log("[onDrop]: mossa rifiutata dal server!");
	}
}
