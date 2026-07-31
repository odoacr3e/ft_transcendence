import { localInfo, localBoard, localPlayers, MACRO }	from "@/scripts/Data/Variables";
import { PIECES_HIGHLIGHT }								from "@/scripts/Helper/piecesHighlights";
import { clearHighlight }								from "@/scripts/Events/utils/HighlightUtils.js";
import { requestToBack }								from "@/scripts/Events/BackLink.js";
import { useAuthStore } 								from "@/stores/auth.st";

// ANCHOR USER INTERACTION FUNCTIONS
export function useAbility()
{
	const clickedId = localInfo.clickedId;
	const square 	= localBoard.get(clickedId);

	if (!square) { return; }

	if (square.useAbilityBool)
	{
		square.useAbilityBool = false;
		localInfo.usingAbility = "";
	}
	else 
	{ 
		square.useAbilityBool = true;
		localInfo.usingAbility = square.piece.type;
		if (MACRO.AUDIO)
			new Audio("/src/assets/audios/useAbility.mp3").play();
		console.log(`who the fuck i am: ${localInfo.usingAbility}`);
	}
	PIECES_HIGHLIGHT[square.piece.type](clickedId);
}

export function shopAbility()
{
	const Piece = localBoard.get(localInfo.clickedId)?.piece;
	const Player = localPlayers.values().find(p => p.isPlaying === true);

	if (!Piece?.isBoostedBool && Player.nPoints >= Piece?.price && localInfo.secondTurn)
		requestToBack(localInfo.clickedId, null).then(
			function(value) {if (value) 
			{ 
				clearHighlight();
				if (MACRO.AUDIO)
					new Audio("/src/assets/audios/boost.mp3").play(); 
			}},
			function(value) {if (!value) { console.log("Shop non completato correttamente"); }}
		);
}

export async function sendEndTurn()
{
	let response;

	response = await requestToBack(null, null);
	if (response) 
	{ 
		clearHighlight();
		if (MACRO.AUDIO)
			new Audio("/src/assets/audios/endTurn.mp3").play();
	}
	else
		console.log("End turn non mandato correttamente");
}

export async function sendGiveUp()
{
	let response;

	response = await requestToBack(null, null, 'giveUp');
	if (response)
	{
		clearHighlight();
		if (MACRO.AUDIO)
			new Audio("vedemmu");
	}
	else
		console.log("Give up non mandato correttamente")
}

export function upgradeBastard(newType)
{
	requestToBack(null, newType).then(
		function(value) {if (value) 
		{ 
			localInfo.goatId = null; 
			clearHighlight(); 
			if (MACRO.AUDIO)
				new Audio("/src/assets/audios/transformation.mp3").play();
		}},
		function(value) {if (!value) { console.log("Mossa non valida"); }}
	);
}

//UTILS - GENERAL UTILS

export function moveDragClone(event)
{
	if (!localInfo.drag || (event.clientX === 0 && event.clientY === 0))
		return;
	localInfo.drag.x = event.clientX;
	localInfo.drag.y = event.clientY;
}

export function checkPermision(event)
{
	if (event.target.localName === "div")	{ localInfo.clickedId = event.target.id; }
	else									{ localInfo.clickedId = event.target.parentNode.id; }
	
	if (localInfo.clickedId === "" || localInfo.clickedId === "board") { return (false) };

	const Square  = localBoard.get(localInfo.clickedId);
	const Piece   = Square.piece;
	const Player  = localPlayers.values().find(p => p.isPlaying === true);

	if (Square.highlight || Square.boostedHighlight) 
		return (true);

	if (Piece && Piece.team != Player.team) { localInfo.lastClickedId = null; return false; }

	return (true);
}

export function checkForHighlightMove()
{	
	let bool;

	if (localInfo.secondTurn && ((localInfo.savedBoostedMap && 
		localInfo.savedBoostedMap.has(localInfo.clickedId)) ||
		localInfo.secondMove))
		bool = true;
	else
		bool =	localBoard.get(localInfo.clickedId).highlight ||
				localBoard.get(localInfo.clickedId).boostedHighlight;
	
	if (localInfo.clickedId !== localInfo.lastClickedId)
	{
		const square = localBoard.get(localInfo.lastClickedId);
		if (square?.piece && !["Bastards","King"].includes(square.piece.type) && !square.useAbilityBool)
			clearHighlight();
	}
	else { clearHighlight("selected"); }
	
	return(bool);
}

export function usingAbility()
{
    const lastSquare  = localBoard.get(localInfo.lastClickedId);
    const square      = localBoard.get(localInfo.clickedId);
	const secondTurn = localInfo.secondTurn;

	const lastUseAbility = lastSquare?.useAbilityBool && lastSquare?.piece.isBoostedBool;
	const useAbility	 = square.useAbilityBool && square.piece.isBoostedBool;

    return (localInfo.usingAbility !== "" && ((localInfo.lastClickedId && (useAbility || lastUseAbility)) || secondTurn));
}

export async function showBoostedMovesHover(fromId)
{
	const auth = useAuthStore();
	if (!auth.socket)
		return;

	const response	= await auth.socket.emitWithAck('simulate_boost', { from: fromId, to: "" });
	const square	= localBoard.get(fromId);
	if (!square)
		return;
	console.log(response);	
	if (response?.log?.status !== 200)
	{
		console.log("[showBoostedMovesHover]: response status != 200!", response);
		return;
	}
	const futureBoostedZones = new Map(
		Object.entries(response.zones || {}).map(([key, value]) =>
			[key, new Set(Array.isArray(value) ? value : [])])
	);
	localInfo.savedBoostedMap = futureBoostedZones;
	for (let toHighlight of futureBoostedZones)
	{

		const isValkirya = localBoard.get(toHighlight[0]).piece.type === "Valkirya";
		const isJester = localBoard.get(toHighlight[0]).piece.type === "Jester";
		for (let id of toHighlight[1])
		{
			const piece = localBoard.get(id)?.piece;
			const pieceTeam = piece?.team;	
			if ((isValkirya || isJester) && pieceTeam === localInfo.myTeam)
			{
				console.log("vediamo: ", pieceTeam !== localInfo.myTeam);
				continue;
			}
			else
				localBoard.get(id).boostedHighlight = true;
		}
	}
}

export async function showBoostedMovesLeave()
{
	clearHighlight("boosted");
}

export function blinkSquares(ids, { times = 3, interval = 300, delay = 300 } = {})
{
	const timers = [];

	[...ids].forEach((id, i) => {
		const square = localBoard.get(id);
		if (!square)
			return;

		timers.push(setTimeout(() => {
			let toggles = 0;
			square.selected = true;
			const blink = setInterval(() => {
				square.selected = !square.selected;
				if (++toggles >= times * 2)
				{
					clearInterval(blink);
					square.selected = false;
				}
			}, interval);
			timers.push(blink);
		}, i * delay));
	});

	return () => {
		timers.forEach(clearTimeout);
		[...ids].forEach(id => {
			const square = localBoard.get(id);
			if (square)
				square.selected = false;
		});
	};
}