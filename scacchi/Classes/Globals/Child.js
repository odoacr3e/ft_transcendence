//@ts-check

import { eChildEvents } from "../../Macro/enums.js";
import { isOneOf } from "../../utils/string.js";
import { gameMessage, roomMessage } from "../../websocket/utils.js";
import { fork } from "child_process";

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
		this.child.on("message", (/** @type {ChildData} */data) => 
		{
			if (isOneOf(data.Event, eChildEvents.Game, eChildEvents.CreateMatch))
			{
				roomMessage(`match_${data.MatchId}`, data.Event, data.Data);
			}
			else if (data.Event == eChildEvents.GameMsg)
			{
				gameMessage(data.MatchId, data.Data);
			}
			else
				throw (`Not correct child event type`);
		});
	}
}

export {Child};