import { usingAbility, checkPermision, 
		checkForHighlightMove, moveDragClone, 
		sendEndTurn,
		shopAbility}	from "./utils/GlobalUtils.js";
import { rightClickSelect, highlightOnClick,
		highlightOnDrag, clearHighlight }		from "./utils/HighlightUtils.js";
import { localInfo, getRootDiv }				from "@/scripts/Data/Variables";
import { PIECES_ABILITY } 						from "@/scripts/Helper/abilityMovement";
import { sendToBackend }						from "./BackLink.js";

// ANCHOR EVENT-LISTENERS FUNCTIONS

export async function globalEvents()
{
	const ROOT_DIV = getRootDiv();
	// ROOT_DIV.setAttribute('tabindex', '0'); --> concetti molto interessanti che non vanno ignorati
	// ROOT_DIV.focus();

	ROOT_DIV.addEventListener("click", async function (event) 
	{
		if (!checkPermision(event))	{ clearHighlight(); return; }
		console.log(`CID: ${localInfo.clickedId}, LCID: ${localInfo.lastClickedId}`);
		if (checkForHighlightMove()) 
		{
			if (usingAbility())
			{
				console.log(`Boosted Piece: ${localInfo.usingAbility}`);				
				await PIECES_ABILITY[localInfo.usingAbility]();
				return;
			}
			sendToBackend(); 
		}
		else	
			highlightOnClick(event);
	});

	ROOT_DIV.addEventListener("mousedown", function (event) {
		rightClickSelect(event);
	});

	ROOT_DIV.addEventListener("dragstart", function (event)
	{
		if ((localInfo.secondMove && localInfo.savedBoostedMap && 
			localInfo.savedBoostedMap.has(event.target.parentNode.id)) || !localInfo.secondMove)
			{
				highlightOnDrag(event);
				//TODO - controllare che questa cosa abbia senso 
				// if (event.target.parentNode.id == localInfo.clickedId)
				// 	localInfo.lastClickedId = null;
				// else
				// 	localInfo.lastClickedId = event.target.parentNode.id;
			}
	});

	ROOT_DIV.addEventListener("drag", function (event) {
		moveDragClone(event);
	});

	ROOT_DIV.addEventListener('dragend', function(event) 
	{
		if (event.target.className === 'piece' && !localInfo.dropDone)
			event.target.style.visibility = 'visible';
		if (localInfo.dropDone) { localInfo.dropDone = false; }

		if (localInfo.dragClone) {
			localInfo.dragClone.remove();
			localInfo.dragClone = null;
		}
	});

	document.addEventListener('keydown', function(event)
	{
		if (event.code === 'Space')
			sendEndTurn();
		if (event.code === 'Enter')
			shopAbility();
	});
}