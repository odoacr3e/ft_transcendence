import { usingAbility, checkPermision, 
			checkForHighlightMove, moveDragClone }				from "./utils/GlobalUtils.js";
import { rightClickSelect, highlightOnClick, highlightOnDrag,
		 clearHighlight }										from "./utils/HighlightUtils.js";
import { localInfo, getRootDiv }								from "@/scripts/Data/Variables";
import { PIECES_ABILITY } 										from "@/scripts/Helper/abilityMovement";
import { sendToBackend }										from "./BackLink.js";

// ANCHOR EVENT-LISTENERS FUNCTIONS

export async function globalEvents()
{
	const ROOT_DIV = getRootDiv();

	ROOT_DIV.addEventListener("click", async function (event) {
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
		console.log("DIO MERDA");
		rightClickSelect(event);
	});

	ROOT_DIV.addEventListener("dragstart", function (event) {
		console.log("DIO MERDA START");
		if ((localInfo.secondMove && localInfo.savedBoostedMap && 
			localInfo.savedBoostedMap.has(event.target.parentNode.id)) || !localInfo.secondMove)
			highlightOnDrag(event);
	});

	ROOT_DIV.addEventListener("drag", function (event) {
		console.log("DIO MERDA DRAG QUEEN");
		moveDragClone(event);
	});

	ROOT_DIV.addEventListener('dragend', function(event) {
		console.log("DIO MERDA END");
		if (event.target.className === 'piece' && !localInfo.dropDone)
			event.target.style.visibility = 'visible';
		if (localInfo.dropDone) { localInfo.dropDone = false; }

		if (localInfo.dragClone) {
			localInfo.dragClone.remove();
			localInfo.dragClone = null;
		}
	});
}