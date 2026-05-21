import { localBoard, localInfo }	from "@/scripts/Data/Variables";
import { setHighlightTrue }			from "./utils/HighlightUtils.js";
import { clearHighlight }			from "@/scripts/Helper/RenderUtils";
import { requestToBack }			from "./BackLink.js";
import { getTarget }				from "./utils/MovementUtils.js"

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
  	localInfo.dragClone.style.position = 'fixed';
  	localInfo.dragClone.style.pointerEvents = 'none';
  	localInfo.dragClone.style.zIndex = '13';
  	localInfo.dragClone.style.width = event.target.offsetWidth + 'px';
  	localInfo.dragClone.style.height = event.target.offsetHeight + 'px';
  	document.body.appendChild(localInfo.dragClone);

  	setTimeout(() => { event.target.style.visibility = 'hidden'; }, 0);
}

export function onDrop(event, toSquare)
{
	event.preventDefault();
	const	fromSquareId = event.dataTransfer.getData('fromSquareId'),
			fromPiece = localBoard.get(fromSquareId).piece;

	if (fromPiece.useAbilityBool)
	{
		const	TargetZone = getTarget(fromSquareId, toSquare.id);

		if (TargetZone)
		{
			localInfo.dropDone = true;
			requestToBack(fromSquareId, toSquare.id).then(
				function(value) {if (value) {
					clearHighlight();
					localInfo.savedBoostedMap = localBoard.get(fromSquareId).boostedTargetZones.get(fromSquareId);
					if (fromPiece.useAbilityBool && fromPiece.type === ("Bastards" || "King" || "Minotaurus"))
					{
						setHighlightTrue(localInfo.savedBoostedMap, "boosted", "both");
						localInfo.secondMove = true;
					}
					if ((fromPiece.type !== ("Bastards" || "King" || "Minotaurus")) || (fromPiece.type === "Minotaurus" && localInfo.secondMove))
						localInfo.usingAbility = "";
				}},
				function(value) {if (!value) { localInfo.dropDone = false; console.log("Mossa non valida"); }}
			);
		}
	}
	else if (fromSquareId !== toSquare.id && localBoard.get(toSquare.id).highlight)
	{
		localInfo.dropDone = true;
		requestToBack(fromSquareId, toSquare.id).then(
			function(value) {if (value) {
				clearHighlight();
				localInfo.usingAbility = "";
			 }},
			function(value) {if (!value) { localInfo.dropDone = false; console.log("Mossa non valida"); }}
		);
	}
}

// let		TargetZone;
// const	boostedZones = localBoard.get(fromSquareId).boostedTargetZones.get(fromSquareId);

// if (((fromPiece.type !== ("Bastards" || "King" || "Minotaurus")) || (fromPiece.type === "Minotaurus" && localInfo.secondMove)) && 
// 	boostedZones.has(toSquare.id))
// 	TargetZone = boostedZones.has(toSquare.id);
// else
// {
// 	TargetZone = localBoard.get(fromSquareId).targetZones.has(toSquare.id);
// 	if (fromPiece.type !== ("Bastards" || "King") && !localInfo.secondMove && !boostedZones.has(toSquare.id))
// 		localInfo.usingAbility = "";
// }