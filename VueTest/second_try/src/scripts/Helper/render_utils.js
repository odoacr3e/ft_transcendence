import { localBoard } from "../Global/Variables";
import { FILES } from "./Constants";

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
        {
            const square = localBoard.get(`${file}${rank}`);
            if (square)
                row.push(square);
        }
        DBoard.push(row);
    }
    return DBoard;
}

export function clearHighlight()
{
	if (!localBoard)
		return;

	localBoard.forEach(square => {
		if (square.highlight === true)
			square.highlight = false;
	})
}