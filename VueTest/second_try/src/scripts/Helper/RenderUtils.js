import { localBoard }   from "../Data/Variables.js";
import { FILES }        from "./Constants.js";

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
		if (square.highlight === true && (flag === "highlight" || flag === undefined))
			square.highlight = false;
	})
}