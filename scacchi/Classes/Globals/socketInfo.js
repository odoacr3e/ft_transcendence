//@ts-check

import { Player } from "../Chess/player.js";
import { Room } from "./room.js";
import { enumSocketState } from "../../Macro/enums.js";

export class SocketInfo
{
	/**
	 * 
	 * @param {import("socket.io").Socket} socket 
	 */
	constructor(socket)
	{
		this.socket = socket;
		this.allowedBool = true;
		this.reconnectBool = false;
		this.state = enumSocketState.NAVIGATING;
		/** @type {Player | null} */
		this.matchData = null;
		/** @type {Room | null} */
		this.roomData = null;
		/** @type {{id: number, me: number, opponent: number, ready: boolean} | null} */
		this.tournamentData = null;
	}
}
