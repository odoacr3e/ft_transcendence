import { usingAbility, checkPermision, 
		checkForHighlightMove, moveDragClone, 
		sendEndTurn,
		shopAbility,
		useAbility}											from "./utils/GlobalUtils.js";
import { rightClickSelect, highlightOnClick,
		highlightOnDrag, clearHighlight }					from "./utils/HighlightUtils.js";
import { localInfo, getRootDiv, localBoard, currentPlayer }	from "@/scripts/Data/Variables";
import { PIECES_ABILITY } 									from "@/scripts/Helper/abilityMovement";
import { sendToBackend }									from "./BackLink.js";

// ANCHOR EVENT-LISTENERS FUNCTIONS

export async function globalEvents()
{
	const ROOT_DIV = getRootDiv();
	// ROOT_DIV.setAttribute('tabindex', '0'); --> concetti molto interessanti
	// ROOT_DIV.focus();

	ROOT_DIV.addEventListener("click", async function(event) 
	{
		if (!checkPermision(event))
		{
			clearHighlight(); 
			return;
		}	
		console.log(`CID: ${localInfo.clickedId}, LCID: ${localInfo.lastClickedId}`);
		if (checkForHighlightMove()) 
		{
			console.log("dentro check");
			if (usingAbility())
			{
				console.log(`Boosted Piece: ${localInfo.usingAbility}`);
				await PIECES_ABILITY[localInfo.usingAbility](localInfo.lastClickedId, localInfo.clickedId, "click");
				return;
			}
			sendToBackend(localInfo.lastClickedId, localInfo.clickedId); 
		}
		else
			highlightOnClick(event);
	});

	ROOT_DIV.addEventListener("mousedown", function(event) {
		rightClickSelect(event);
	});

	ROOT_DIV.addEventListener("dragstart", function(event)
	{
		if (((localInfo.secondMove && localInfo.savedBoostedMap && 
			localInfo.savedBoostedMap.has(event.target.parentNode.id)) || !localInfo.secondTurn) && localBoard.get(event.target.parentNode.id)?.piece?.team === localInfo.myTeam)
			{
				console.log("sono qui");				
				highlightOnDrag(event);
			}
	});

	ROOT_DIV.addEventListener("drag", function(event) {
		moveDragClone(event);
	});

	ROOT_DIV.addEventListener("dragend", function() 
	{
		clearHighlight("clicked");
		localInfo.drag = null;
	});

	document.addEventListener("keydown", async function(event)
	{
		if (event.code === "Space" && localInfo.secondTurn)
			await sendEndTurn();
		if (event.code === "Enter" && localBoard.get(localInfo.clickedId)?.piece.team === currentPlayer().team)
			shopAbility();
		if (event.code === "ShiftLeft" && localBoard.get(localInfo.clickedId)?.piece.isBoostedBool)
			useAbility();
	});
}