import { getSquareColor, localBoard }   from "../Global/Variables.js";
import { FILES }                        from "./Constants.js";

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
		if (square.highlight === true && (flag === "point" || flag === undefined))
			square.highlight = false;
		const style = document.getElementById(square.id).style;
		if (style.backgroundColor == "brown")
			style.backgroundColor = getSquareColor(square.id);
		if (style.backgroundColor == "red" && (flag === "square" || flag === undefined))
		{
			if (getSquareColor(square.id) == "white") { style.backgroundColor = "white"; style.borderWidth = "0"; style.borderColor = "trasparent"; }
			else { style.backgroundColor = "rgb(27, 0, 0)"; style.borderWidth = "0"; style.borderColor = "trasparent"; }
		}
	})
}