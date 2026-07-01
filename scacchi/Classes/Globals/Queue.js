//@ts-check

import { includesOneOf } from "../../utils/string.js";
import { eMatchPresets } from "../../Macro/enums.js";
import { matchMakingOpt } from "../endPoint/matchInit.js";

/** @typedef {import("../Chess/match.js").MatchSettings} MatchSettings*/

const fourPresets = [
	eMatchPresets.ClassicFourPlayers,
	eMatchPresets.ClassicFreeForAll,
	eMatchPresets.NoCornersFourPlayers];

/**
 * @extends {Map<string, QueueNode>}
 */
export class Queue extends Map
{
	/** @param {string} roomType*/
	constructor(roomType) 
	{
		super();
		this.roomType = roomType;
	}
	/**
	 *  @param {string} userId
	 *  @param {matchMakingOpt} options
	*/
	AddNode(userId, options)
	{
		this.set(userId, new QueueNode(options));
		this.get(userId)?.userSet.add(userId);
	}
	/** @param {string} userId */
	DelNode(userId)
	{
		let	node;

		node = this.get(userId);
		if (node)
			node.userSet.delete(userId);
		this.delete(userId);
	}
	/**
	 * @param {string} fromId 
	 * @param {string} toId 
	 */
	MergeNode(fromId, toId)
	{
		let	toNode;

		this.DelNode(fromId);
		toNode = this.get(toId);
		if (!toNode)
			throw (`Queue, MergeNode: toNode ${toNode} does not exist`);
		this.set(fromId, toNode);
	}
	// /** @param {string} userId */
	// Find(userId)
	// {
	// 	let options;

	// 	this.get(userId);
	// }
}

class QueueNode
{
	/**
	 *  @param {matchMakingOpt} options
	*/
	constructor(options)
	{
		/** @type {Set<string>} */ 			this.userSet = new Set();
		/** @type {MatchSettings | null}*/	this.matchOptions = options.matchSettings;
		/** @type {string} */				this.matchType = options.matchType;
		/** @type {number} */				this.minPlayers = 2;
		/** @type {number} */				this.currPlayers = 1;

		if (includesOneOf(this.matchType, fourPresets))
			this.minPlayers = 4;
	}
}