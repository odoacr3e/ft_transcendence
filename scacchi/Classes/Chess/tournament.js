//@ts-check

import { eMatchPresets } from "../../Macro/enums";
import { rng } from "../../utils/random";
import {compareSync, hashSync} from "bcrypt";

/** @typedef {number} matchId */
/** @typedef {number} userId */
/** @typedef {Array<Array<matchId>>} OldMatch */
/** @typedef {Array<Array<userId>>} UserIds */

/*
### Oggetto torneo

- Array(round)<Array(matches)<matchId>> oldMatchIds
- Array(round)<Array(users)<matchId>> usersId
- string matchType
- number playerNum
*/

class Tournament
{
	/**
	 * 
	 * @param {string} matchType 
	 * @param {number} playerNum 
	 */
	constructor (matchType=eMatchPresets.ClassicTwoPlayers, playerNum=8)
	{
		this.id = "";//NOTE - prendiamo da prisma
		/** @type {OldMatch} */
		this.oldMatchIds = new Array();
		this.startUserIds = new Set();
		/** @type {UserIds} */
		this.userIds = new Array();
		this.matchType = matchType;
		this.playerNum = playerNum;
		if (playerNum != 8)
		{
			console.log("non supportato");
			this.playerNum = 8;
		}
		this.round = 0;
		this.activeMatches = 0;
		this.first = "";
		this.second = "";
		this.third = ["", ""];
	}
	RNGplayer()
	{
		this.userIds.at(0)?.sort(() => 
		{
			return (rng(2) == 1? -1: 1);
		});
	}
	initAllMatches()
	{
		console.log("not implemented");
	}
	/** @param {number} id */
	addUser(id)
	{
		this.startUserIds.add(id);
	}
	/** @param {number} id */
	delUser(id)
	{
		this.startUserIds.delete(id);
	}
	/** @param {number} id */
	addMatch (id)
	{
		if (!this.oldMatchIds.at(this.round))
			this.oldMatchIds[this.round] = new Array();
		this.oldMatchIds[this.round].push(id);
	}
	nextRound()
	{
		this.round += 1;
	}
}
