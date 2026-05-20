import { localBoard, localPlayers, localInfo, FILES }	from "@/scripts/Data/Variables.js";

//Funzione helper per convertire la mappa in un array 8x8
export function boardConverter()
{
    const DBoard = [];

    if (!localBoard || localBoard.size === 0) {
        console.warn("[boardConverter]: localBoard è vuoto o null");
        return [];
    }

    for (let rank = 8; rank >= 1; rank -= 1)
	{
		
		const row = [];
		for (const file of FILES)
			row.push(localBoard.get(`${file}${rank}`));
		DBoard.push(row);
	}
    return DBoard;
}

/**
 * @param {Number} p 
 */
export function getLocalPlayers(p) {
	if (p === 1)		{ return (localPlayers.get("p1")); }
	else if (p === 2)	{ return (localPlayers.get("p2")); }
	else if (p === 3)	{ return (localPlayers.get("p3")); }
	else if (p === 4)	{ return (localPlayers.get("p4")); }

	return (null);
}

//Funzione helper per determinare il colore dello square durante la cotruzione della scacchiera
export function getSquareColor(squareId) 
{
	const col = squareId.charCodeAt(0) - 97;
	const row = parseInt(squareId[1]);
	return (row + col) % 2 === 0 ? "white" : "black";
}

export function clearHighlight(flag)
{
	localBoard.forEach(square => {
		if (square.selected === true && (flag === "selected" || flag === undefined))
			square.selected = false;
		if ((square.highlight === true || square.boostedHighlight == true)&& (flag === "highlight" || flag === undefined))
			{
				square.highlight = false;
				square.boostedHighlight = false;
			}
	})
}

export function resetPrice() { localInfo.priceSelected = "..."; }