import { localBoard, localInfo } from "@/scripts/Data/Variables";

export function getTarget(fromId, toId)
{
    const	boostedZones = localBoard.get(fromId).boostedTargetZones.get(fromId);
    const	fromP = localBoard.get(fromId).piece ? localBoard.get(fromId).piece : null;

    if (fromP?.useAbilityBool && boostedZones.has(toId) &&
        (!["Bastards","King","Minotaurus"].includes(fromP?.type) || (fromP?.type === "Minotaurus" && localInfo.secondMove)))
        return (boostedZones.has(toId));
    else
    {
        if (!["Bastards","King"].includes(fromP?.type) && !localInfo.secondMove && !boostedZones.has(toId))
            localInfo.usingAbility = "";
        return (localBoard.get(fromId).targetZones.has(toId));
    }
}
