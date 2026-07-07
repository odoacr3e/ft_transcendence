//@ts-check

import { includesOneOf } from "../../utils/string.js";
import { eMatchPresets } from "../../Macro/enums.js";
import { matchMakingOpt } from "../endPoint/matchInit.js";
import { enumConnection } from "../../Macro/enums.js";
import { globals } from "./globals.js";
import { findMatch } from "../../websocket/MatchMaking/MatchMaking.js";

/** @typedef {import("../Chess/match.js").MatchSettings} MatchSettings*/
/** @typedef {{id_user: string, points: number}} dbUser*/
/** @typedef {{from: number, to: number, avg: number}} EloRange*/

const fourPresets = [
	eMatchPresets.ClassicFourPlayers,
	eMatchPresets.ClassicFreeForAll,
	eMatchPresets.NoCornersFourPlayers];

/**
 * key: userId
 * val: user matchMaking node
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
	/**
	 *  
	 * @param {string} id_user 
	 * @param {boolean} resetTimerBool
	 * */
	DelNode(id_user, resetTimerBool=true)
	{
		let	node;
		let	tmpArray;
		let	isLeader = false;
		let	newLeaderId;

		node = this.get(id_user);
		if (!node)
			return ;
		tmpArray = Array.from(node.userSet);
		isLeader = node.userSet.size > 1 && tmpArray.indexOf(id_user) == 0;
		newLeaderId = tmpArray[1];
		node.userSet.delete(id_user);
		this.delete(id_user);
		//NOTE - if it was not the leader socket, its ok to just remove it
		if (isLeader == false || !resetTimerBool)
			return ;
		//NOTE - even the second is reconnecting, lol
		//if it disconnects: it will call delNode
		//if it reconnects: it will call matchMaking
		if (globals.clientMap.get(id_user)?.reconnectBool == true)
			return ;
		//NOTE - else, the newLeader will search new playmates
		clearTimeout(globals.timers.get(id_user));
		clearTimeout(globals.timers.get(newLeaderId));
		console.log("new matchMaking leader: old is", id_user, "new is", newLeaderId);
		globals.timers.set(id_user, setTimeout(() => {
			findMatch(this, {id_user: newLeaderId, points: node.eloRange.avg});
		}, 5000));
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
			if (userOption.matchType != value.matchType)//tipo di match diverso
				continue ;
			if (value.userSet.size == value.minPlayers)//match gia pieno
				continue ;
			if (globals.clientMap.get(key)?.reconnectBool == true)//avversario con problemi di connessione
				continue ;
			// if (this.roomType == enumConnection.RANKED)//TODO - 	controlli vari per la ranked
			// {
			// }
			foundBool = true;
			this.MergeNode(key, user.id_user);
			globals.ClearTimer(key);
			globals.ClearTimer(user.id_user);
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
		/** @type {Set<string>} */ 					this.userSet = new Set();
		/** @type {EloRange} */						this.eloRange = {from: 0, to: 2200, avg: 1100};
		/** @type {MatchSettings | null}*/			this.matchOptions = options.matchSettings ? options.matchSettings:null;
		/** @type {string} */						this.matchType = options.matchType;
		/** @type {number} */						this.minPlayers = 2;

		if (includesOneOf(this.matchType, fourPresets))
			this.minPlayers = 4;
	}
	IsFull()
	{
		return (this.userSet.size == this.minPlayers);
	}
}