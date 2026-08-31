//@ts-check

import { eWorkerEvents } from "../../Macro/enums";
import { globals } from "./globals";
import { fork } from "child_process";

/**
 * @typedef {{
 *	WorkerId: number,
 *	MatchId: number | undefined,
 *	Event: string
 *	Data: *,
 * }} WorkerData
 */

class worker
{
	/** @param {number} index */
	constructor(index)
	{
		this.child = fork("utils/worker.js");
		/** @type {Set<number>} */
		this.matchSet = new Set;
		this.id = index;

		globals.workerMap.set(index, this);
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
		/** @type {WorkerData} */
		let	workerData;

		workerData = {WorkerId: this.id, MatchId: matchId, Event: event, Data: data};
		this.child.send(workerData);
	}
	SetListeners()
	{
		this.child.on("spawn", () => 
		{
			this.Send(eWorkerEvents.Init, null);
		});
	}
}

export {worker};