import { localBoard } from "../Data/Variables";

const PIECES_ABILITY = Object.freeze ({
	"King" : moveKing,
	"Champion" : "giorgio",
	"Jester" : "giorgio",
	"Valkirya" : "giorgio",
	"Minotaurus" : "giorgio",
	"Bastards" : "giorgio",
})

export function moveKing(from, to)
{
	const hasBoost = localBoard.get(from).piece.isBoostedBool;
	const useAbility = localBoard.get(from).piece.useAbilityBool;
	const hasAndUse = hasBoost && useAbility;

	if (!hasAndUse)
		return;

	//logica per applicare il movimento boostato oppure il movimento normale
}
