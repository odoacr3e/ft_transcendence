import { computePosition, offset, flip, shift, autoUpdate }	from "@floating-ui/dom";
import { localBoard, localInfo, currentPlayer } 			from "../Variables";
import { clearHighlight }									from "@/scripts/Events/utils/HighlightUtils.js";
import { playAudio } 										from "@/scripts/Helper/generalUtils";

let stopAutoUpdate = null;

export function hasBoost (curP)
{
	localInfo.hasBoost = false;
	localBoard.forEach(square => {
		if (square.piece && square.piece.isBoostedBool)
			if (square.piece.team === curP.team)
				localInfo.hasBoost = true;
	});
}

export function checkEndTurn(validated)
{
	let		newCurP;
	const	players_list = ["p1", "p2", "p3", "p4"];
	const	curP = currentPlayer();

	players_list.forEach((player) => {
		if (validated[player]?.isPlaying) { newCurP = validated[player]; };
	});

	if (curP.name === newCurP.name) { localInfo.secondTurn = true; }
	else
		resetLocalVars();
}

export function setVictory(team, sound = true)
{
	const next = team || null;

	if (next === localInfo.victory)
		return;

	localInfo.victory = next;
	if (!sound || !next)
		return;

	if (next === "draw")
		playAudio("draw");
	else if (next === localInfo.myTeam)
		playAudio("victory");
	else 
		playAudio("lost");
}

export function checkUpgrade()
{
	const	curP = currentPlayer();

	if (curP.team !== localInfo.myTeam)
		return;

	localBoard.forEach((square ,id) => {
		if (((id.charAt(1) === '1' && curP.team === "black") ||
			(id.charAt(1) === '8' && curP.team === "white")) &&
			square.piece && square.piece.type === "Bastards")
		{
			localInfo.goatId = id;
			localInfo.secondTurn = false;
			requestAnimationFrame(() => {
				const fromEl = document.getElementById(id);
				const menuEl = document.getElementById("choseMenu");

				if (!fromEl || !menuEl) { return; }

				function updatePosition() {
					computePosition(fromEl, menuEl, {
						middleware: [
							offset(6),
							flip(),
							shift({ padding: 5 })
						],
						strategy: 'fixed'
					})
					.then(({ x, y }) => {
						menuEl.style.position = 'fixed';
						menuEl.style.pointerEvents = 'auto';
						if (id.charAt(1) === '8')
						{
							menuEl.style.top = '-6px';
							menuEl.style.left = '0px';
						}
						else
						{
							menuEl.style.top = '-173px';
							menuEl.style.left = '-75px';
						}
						menuEl.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
					})
					.catch(console.error);
				}
				if (stopAutoUpdate) { stopAutoUpdate(); stopAutoUpdate = null; }
                stopAutoUpdate = autoUpdate(fromEl, menuEl, updatePosition);
			});
		}
	});
}

export function stopUpgradeMenu()
{
	if (stopAutoUpdate)
	{
		stopAutoUpdate();
		stopAutoUpdate = null;
	}
}

export function assignLastMoveSquares(oldSquare, newSquare, newSet)
{
	const oldPiece	 = oldSquare.piece;
	const newPiece	 = newSquare.piece;
	const oldPSignat = oldPiece ? oldPiece.team + ":" + oldPiece.type : null;
	const newPSignat = newPiece ? newPiece.team + ":" + newPiece.type : null;
	const isOldEmpty = oldPSignat === null;
	const isNewEmpty = newPSignat === null;

	if (!isOldEmpty && isNewEmpty)
		newSet.add(oldSquare.id);
	if (isOldEmpty && !isNewEmpty)
		newSet.add(oldSquare.id);
	if (!isOldEmpty && !isNewEmpty && oldPSignat !== newPSignat)
		newSet.add(oldSquare.id);
}

export function resetLocalVars()
{
	localInfo.clickedId			= null;
	localInfo.lastClickedId		= null;
	localInfo.usingAbility		= "";
	localInfo.savedBoostedMap	= null;
	localInfo.secondTurn		= false;
	localInfo.secondMove		= false;
	localInfo.drag				= null;
	localInfo.pending			= null;
	localInfo.drawOffer			= null;

	localBoard.forEach(square => {
		if (square.useAbilityBool)
			square.useAbilityBool = false;
	});
	clearHighlight();
}