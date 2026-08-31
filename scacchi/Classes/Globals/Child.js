//@ts-check

import { eChildEvents } from "../../Macro/enums.js";
import { isOneOf } from "../../utils/string.js";
import { gameMessage, roomMessage } from "../../websocket/utils.js";
import { fork } from "child_process";
import { Result } from "../endPoint/result.js";

/**
 * @typedef {{
 *	ChildId: number,
 *	MatchId: number | undefined,
 *	Event: string,
 *	Data: *,
 * }} ChildData
 */

class Child
{
	/** @param {number} index */
	constructor(index)
	{
		/** @type {Set<number>} */
		this.matchSet = new Set;
		this.id = index;
		this.child = fork("handlers/child/child.js");

		this.SetListeners();
	}
	/**
	 * 
	 * @param {string} event 
	 * @param {*} data 
	 * @param {number | undefined} matchId 
	 */
	Send(event, data, matchId=undefined)
	{
		/** @type {ChildData} */
		let	childData;

		childData = {ChildId: this.id, MatchId: matchId, Event: event, Data: data};
		this.child.send(childData);
	}
	SetListeners()
	{
		this.child.on("spawn", () => 
		{
			this.Send(eChildEvents.Init, null);
		});
		this.child.on("close", () => 
		{
			console.log(`figlio con id ${this.id} ha chiuso i ponti col padre`);
			for (let ids of this.matchSet)
				roomMessage(`match_${ids}`, "error", new Result().Error("game crash", 500));
			this.child = fork("handlers/child/child.js");
			this.matchSet.clear();
			this.SetListeners();
		});
		this.child.on("disconnect", () => 
		{
			console.log(`figlio con id ${this.id} e morto in guerra`);
		});
		this.child.on("message", (/** @type {ChildData} */data) => 
		{
			if (isOneOf(data.Event, eChildEvents.Game, eChildEvents.CreateMatch, eChildEvents.GameMsg))
			{
				roomMessage(`match_${data.MatchId}`, data.Event, data.Data);
			}
			else if (data.Event == eChildEvents.Error)
			{
				console.log(`child ${this.id} error`);
				console.log(JSON.stringify(data, null, 2));
				console.trace();//@ts-ignore
				roomMessage(`match_${data.MatchId}`, "error", new Result().Error((data.Data), 500));
			}
			else
				throw (`Not correct child event type`);
		});
	}
}

export {Child};