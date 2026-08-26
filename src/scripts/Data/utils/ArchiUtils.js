import { computePosition, offset, flip, shift, autoUpdate }	from "@floating-ui/dom";
import { emptyCapturedPieces, localBoard, localInfo, localPlayers, Square } 		from "../Variables";
import { clearHighlight }									from "@/scripts/Events/utils/HighlightUtils.js";

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
	const	curP = localPlayers.values().find(p => p.isPlaying === true);

	players_list.forEach((player) => {
		if (validated[player]?.isPlaying) { newCurP = validated[player]; };
	});

	if (curP.name === newCurP.name) { localInfo.secondTurn = true; }
	else
		resetLocalVars();
}

export function checkUpgrade()
{
	//NOTE - Disattivata: il menu #choseMenu e' stato rimosso dal template di ChessBoard.vue
	//(commit e086215f), quindi goatId restava acceso per sempre: overlay nero sulla board,
	//bottone "End Turn" spento (secondTurn = false) e badge di boost/ability disabilitati.
	//Togliere questo return quando il menu di promozione viene ripristinato.
	return;

	// eslint-disable-next-line no-unreachable
	const	curP = localPlayers.values().find(p => p.isPlaying === true);

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

export function isValidTeam(team)
{
	if (!team || typeof team != "string")
		return (false);
	return ([...localPlayers.values()].some(p => p.team === team));
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

	if (localInfo.victory)
	{
		console.log("resettiamo i pezzi catturati");
		localInfo.capturedP		= { white: emptyCapturedPieces(),
									black: emptyCapturedPieces() };
	}

	localBoard.forEach(square => {
		if (square.useAbilityBool)
			square.useAbilityBool = false;
	});
	clearHighlight();
}