//@ts-check

import { includesOneOf } from "../../utils/string.js";
import { eMatchPresets } from "../../Macro/enums.js";
import { matchMakingOpt } from "../endPoint/matchInit.js";
import { enumConnection } from "../../Macro/enums.js";
import { globals } from "./globals.js";

/** @typedef {import("../Chess/match.js").MatchSettings} MatchSettings*/
/** @typedef {{id_user: string, points: number}} dbUser*/

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
	 *  @param {dbUser} user
	 *  @param {matchMakingOpt} options
	*/
	AddNode(user, options)
	{
		if (this.has(user.id_user))
			return ;
		this.set(user.id_user, new QueueNode(options));
		this.get(user.id_user)?.userSet.add(user.id_user);
	}
	/** @param {string} id_user */
	DelNode(id_user)
	{
		let	node;

		node = this.get(id_user);
		if (node)
			node.userSet.delete(id_user);
		this.delete(id_user);
	}
	/**
	 * @param {string} fromId 
	 * @param {string} toId 
	 */
	MergeNode(fromId, toId)
	{
		let	toNode;

		// this.DelNode(fromId);
		toNode = this.get(toId);
		if (!toNode)
			throw (`Queue, MergeNode: toNode ${toNode} does not exist`);
		this.set(fromId, toNode);
		toNode.userSet.add(fromId);
	}
	/** @param {dbUser} user */
	Find(user)
	{
		let userOption;
		let	foundBool = false;

		userOption = this.get(user.id_user);
		if (!userOption)
			throw (`Queue, Find: get of id_user ${user.id_user} does not exist`);
		for (let [key, value] of this)
		{
			if (key == user.id_user)//se stesso
				continue ;
			if (userOption.matchType != value.matchType)//match diverso
				continue ;
			if (value.userSet.size == value.minPlayers)//controlli il numero di player nel match
				continue ;
			// if (this.roomType == enumConnection.RANKED)//TODO - 	controlli vari per la ranked
			// {
			// }
			foundBool = true;
			this.MergeNode(key, user.id_user);
			clearTimeout(globals.timers.get(key));//NOTE - Claude dice che non da problemi fare clear due volte o su undefined
			clearTimeout(globals.timers.get(user.id_user));
			if (this.get(user.id_user)?.IsFull())
				break ;
		}
		return (foundBool);
	}
}

export class QueueNode
{
	/**
	 *  @param {matchMakingOpt} options
	*/
	constructor(options)
	{
		/** @type {Set<string>} */ 			this.userSet = new Set();
		/** @type {MatchSettings | null}*/	this.matchOptions = options.matchSettings ? options.matchSettings:null;
		/** @type {string} */				this.matchType = options.matchType;
		/** @type {number} */				this.minPlayers = 2;

		if (includesOneOf(this.matchType, fourPresets))
			this.minPlayers = 4;
	}
	IsFull()
	{
		return (this.userSet.size == this.minPlayers);
	}
}