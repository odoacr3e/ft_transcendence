import { computePosition, offset, flip, shift, autoUpdate }	from "@floating-ui/dom"; 
import { localBoard, localInfo, localPlayers } from "../Variables";

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
		if (validated[player].isPlaying) { newCurP = validated[player]; };
	})

	if (curP.name === newCurP.name) { localInfo.secondTurn = true; }
	else
	{
		localInfo.secondTurn = false;
		localInfo.savedBoostedMap = null;
	}
}

export function DEBUGSetVisible()
{
	localBoard.forEach((square , key) => {
		if (square.piece)
		{
			const DOMPiece = document.getElementById(key).getElementsByClassName("piece")[0];
			if (DOMPiece && DOMPiece.style.visibility === "hidden")
				DOMPiece.style.visibility = "visible";
		}
	});
}

export function checkUpgrade()
{
	const	curP = localPlayers.values().find(p => p.isPlaying === true);

	localBoard.forEach((square ,id) => {
		if ((id.charAt(1) === '1' && curP.team === "black") ||
			(id.charAt(1) === '8' && curP.team === "white") &&
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
	})
}
