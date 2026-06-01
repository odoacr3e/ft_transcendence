import { localBoard, localInfo }	from "@/scripts/Data/Variables";
import { clearHighlight }			from "@/scripts/Events/utils/HighlightUtils.js";
import { requestToBack }			from "./BackLink.js";
import { PIECES_ABILITY } 						from "@/scripts/Helper/abilityMovement";

// Deprecata
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

	event.dataTransfer.setDragImage(event.target, window.outerWidth, window.outerHeight);

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

	//FIXME - DOBBIAMO ASSICURARCI CHE QUESTO NON ROMPI NULLA
	localInfo.lastClickedId = event.target.parentNode.id;

  	setTimeout(() => { event.target.style.visibility = 'hidden'; }, 0);
}

export function onDrop(event, toSquare)
{
	event.preventDefault();
	const	fromSquareId = event.dataTransfer.getData('fromSquareId');

	if (localBoard.get(fromSquareId).useAbilityBool || localInfo.secondMove)
		PIECES_ABILITY[localInfo.usingAbility](fromSquareId, toSquare.id, "").then ();
	else if (fromSquareId !== toSquare.id && localBoard.get(toSquare.id).highlight)
	{
		localInfo.dropDone = true;
		requestToBack(fromSquareId, toSquare.id).then(
			function(value) {if (value) {
				// localInfo.dropDone = true;
				clearHighlight();
				localInfo.usingAbility = "";
			 }
			if (!value) { localInfo.dropDone = false; console.log("Mossa non valida"); }
			}
		);
	}
}

// const	TargetZone = getTarget(fromSquareId, toSquare.id);
		// let		boostMap;
		// if (!localInfo.secondMove)
		// {
		// 	if (["Minotaurus", "Champion"].includes(fromPiece?.type))
		// 		boostMap = localBoard.get(fromSquareId).boostedTargetZones.get(toSquare.id);
		// 	else
		// 		boostMap = localBoard.get(fromSquareId).boostedTargetZones.get(fromSquareId);
		// }

		// if (TargetZone)
		// {
		// 	localInfo.dropDone = true;
		// 	requestToBack(fromSquareId, toSquare.id).then(
		// 		function(value) { if (value) {
		// 			clearHighlight();
					
		// 			if (!localInfo.secondMove)
		// 			{
		// 				localInfo.savedBoostedMap = boostMap;
		// 				if (["Bastards","King","Minotaurus","Champion"].includes(fromPiece?.type))
		// 					localBoard.get(toSquare.id).piece.useAbilityBool = true;
		// 			}

		// 			if (!["Bastards","King","Minotaurus","Champion"].includes(fromPiece?.type) ||
		// 				(["Minotaurus", "Champion"].includes(fromPiece?.type) && localInfo.secondMove))
		// 				localInfo.usingAbility = "";

		// 			if (fromPiece.useAbilityBool && !localInfo.secondMove && 
		// 				["Bastards","King","Minotaurus","Champion"].includes(fromPiece?.type))
		// 			{
		// 				setHighlightTrue(localInfo.savedBoostedMap, "boosted", "both");
		// 				localInfo.secondMove = true;
		// 			}
		// 		}},
		// 		function(value) {if (!value) { localInfo.dropDone = false; console.log("Mossa non valida"); }}
		// 	);
		// }