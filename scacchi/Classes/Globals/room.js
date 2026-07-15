//@ts-check

import { enumConnection } from "../../Macro/enums.js";
import {compareSync, hashSync} from "bcrypt";
import { HASH_SALT } from "../../Macro/macro.js";
import { Result } from "../endPoint/result.js";

export class Room
{
	/** 
	 * @param {number} ownerId
	 * @param {number} max
	 * @param {string | undefined} name
	 * @param {string} roomType
	 */
	constructor (ownerId, max, name=undefined, roomType=enumConnection.TOURNAMENT)
	{
		this.id = `${Date.now}_${ownerId}`;
		if (name == undefined)
			name = 'Tournament';
		this.name = name;
		this.cryptId = this.CryptId();
		this.players = new Set();
		this.players.add(ownerId);
		this.maxPlayers = max;
		this.connType = roomType;
		if (this.connType != enumConnection.TOURNAMENT)
			throw (`Room: error in connection type ${this.connType}`);
	}
	CryptId()
	{
		return (hashSync(this.id, HASH_SALT));
	}
	/**
	 * 
	 * @param {number} id 
	 */
	addPlayer(id)
	{
		let result;

		if (this.players.size == this.maxPlayers)
			result = new Result().Error(`Match is already full`, 403);
		else if (this.players.has(id))
			result = new Result().Error(`Player already inside the room`, 400);
		else
		{
			this.players.add(id);
			result = new Result().Success();
		}
		return result;
	}
}