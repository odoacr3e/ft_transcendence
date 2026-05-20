import { useAbility, 
		shopAbility, 
		sendEndTurn, 
		usingAbility, 
		checkPermision, 
		checkForHighlightMove,}									from "./utils/GlobalUtils.js";
import { localInfo, getRootDiv }								from "@/scripts/Data/Variables";
import { rightClickSelect, highlightOnClick, highlightOnDrag }	from "./utils/HighlightUtils.js";
import { clearHighlight }										from "@/scripts/Helper/RenderUtils";
import { PIECES_ABILITY } 										from "@/scripts/Helper/abilityMovement";
import { computePosition }										from "@floating-ui/dom";
import { sendToBackend }										from "./temp.js";

// ANCHOR EVENT-LISTENERS FUNCTIONS

async function globalEvents()
{
	const ROOT_DIV = getRootDiv();

	ROOT_DIV.addEventListener("click", async function (event) {
		if (!checkPermision(event))	{ clearHighlight(); return; }
		// console.log(`CID: ${localInfo.clickedId}, LCID: ${localInfo.lastClickedId}`);
		if (checkForHighlightMove()) 
		{
			if (usingAbility())
			{
				await PIECES_ABILITY[localInfo.usingAbility]();
				return;
			}
			sendToBackend(); 
		}
		else
			highlightOnClick(event);
	});

	ROOT_DIV.addEventListener("dragstart", function (event) {
		if ((localInfo.secondMove && localInfo.savedBoostedMap && 
			localInfo.savedBoostedMap.has(event.target.parentNode.id)) || !localInfo.secondMove)
			highlightOnDrag(event);
	});

	ROOT_DIV.addEventListener("mousedown", function (event) {
		rightClickSelect(event);
	});

	ROOT_DIV.addEventListener("drag", function (event) {
		if (event.target.className === "piece")
		{
			if (event.clientX === 0 && event.clientY === 0) return;

			const cursor = {
				getBoundingClientRect() {
				  return {
					  	width: 0,
						height: 0,
						x: event.clientX,
						y: event.clientY,
						left: event.clientX,
						right: event.clientX,
						top: event.clientY,
						bottom: event.clientY
					};
					}
				};

				computePosition(cursor, localInfo.dragClone).then(({ x, y }) => {
					Object.assign(localInfo.dragClone.style, {
					top: `${y - 40}px`,
					left: `${x}px`
					});
				});
		}
	});

	ROOT_DIV.addEventListener('dragend', function(event) {
		if (event.target.className === 'piece' && !localInfo.dropDone)
			event.target.style.visibility = 'visible';
		if (localInfo.dropDone) { localInfo.dropDone = false; }

		if (localInfo.dragClone) {
			localInfo.dragClone.remove();
			localInfo.dragClone = null;
		}
	});
}

export { globalEvents, sendToBackend, useAbility, shopAbility, sendEndTurn };