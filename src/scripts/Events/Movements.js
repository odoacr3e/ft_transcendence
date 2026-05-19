import { localBoard, localInfo }	from "@/scripts/Data/Variables";
import { updateMatchState }			from "@/scripts/Data/Archi"
import { clearHighlight }			from "@/scripts/Helper/RenderUtils";
import { setHighlightTrue }			from '@/scripts/Events/Global'

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

	const fromSquareId = event.dataTransfer.getData('fromSquareId');
	if (localInfo.secondMove || localBoard.get(fromSquareId).piece.useAbilityBool)
	{
		let TargetZone;
		const boostedZones = localBoard.get(fromSquareId).boostedTargetZones.get(fromSquareId);
		if (localBoard.get(fromSquareId).piece.type !== ("Bastards" || "King"))
			TargetZone = localBoard.get(fromSquareId).boostedTargetZones.has(toSquare.id);
		else
			TargetZone = localBoard.get(fromSquareId).targetZones.has(toSquare.id);
		if (TargetZone)
		{
			localInfo.dropDone = true;
			requestToBack(fromSquareId, toSquare.id).then(
				function(value) {if (value) {
					clearHighlight();
					setHighlightTrue(boostedZones, "boosted", "both");
					localInfo.savedBoostedMap = boostedZones;
					localInfo.secondMove = true;
				}},
				function(value) {if (!value) { localInfo.dropDone = false; console.log("Mossa non valida"); }}
			);
		}
	}
	else if (fromSquareId !== toSquare.id && localBoard.get(toSquare.id).highlight)
	{
		localInfo.dropDone = true;
		requestToBack(fromSquareId, toSquare.id).then(
			function(value) {if (value) { clearHighlight(); }},
			function(value) {if (!value) { localInfo.dropDone = false; console.log("Mossa non valida"); }}
		);
	}
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
