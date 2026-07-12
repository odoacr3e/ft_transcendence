// @ts-check
import fs from "fs";

import {Cursor} from "./cursor.js";
import {eTeam, eMatchPresets} from "../../Macro/enums.js";
import {Square, initBoard, copyBoard, copyBoostedTargetZones, ChessBoard} from "./chessBoard.js";
import {HISTORY_PATH, CHESSBOARD_W, CHESSBOARD_H} from "../../Macro/macro.js";
import {Result} from "../endPoint/result.js";
import {Player} from "./player.js";
import {boardStringify} from "../../test/render.js";
import { isDangerous } from "../../utils/checkDanger.js";
import { DangerUpdate } from "../../utils/dangerUpdate.js";
import { History } from "./history.js";
import { clientBoard } from "../../handlers/game/utils.js";
import { MATCHTIMER } from "../../Macro/macro.js"; 
import { globals } from "../Globals/globals.js";
import { match } from "assert/strict";

/** @typedef {import("../Globals/Queue.js").QueueNode} QueueNode*/

class Match
{

	/** @param {MatchSettings | string | null} preset*/
	constructor(preset=null)
	{
		let	w;
		let	h;
	
		if (!preset && !this.settings)
			this.settings = new MatchSettings(matchPresets.twoPlayer);
		else
			this.settings = new MatchSettings(preset);
		this.white = new Player(eTeam.White, this.settings);
		this.black = new Player(eTeam.Black, this.settings);
		this.red = new Player(eTeam.Red, this.settings);
		this.blue = new Player(eTeam.Blue, this.settings);
		this.green = new Player(eTeam.Green, this.settings);
		this.yellow = new Player(eTeam.Yellow, this.settings);
		/** @type {Array<{id_user: string, outcome: string, startTeam: string | null, team: string}>} */
		this.users = [];
		w = this.settings.board.width;
		h = this.settings.board.heigth;
		this.board = new ChessBoard(w, h);
		this.cursor = new Cursor(w, h);
		this.moves = 0;
		this.boost = 0;
		this.history = new History(this.settings);
		this.historyCreateBool = false;
		this.currentPlayer = this.white;
		this.lastMenace = {from: "", mid: "", to: ""};
		this.boostPriority = new Set;
		this.playerNum = this.settings.players.number;
		this.lastLost = "";
		this.victory = "";
		/** @type {Timer | null} */ this.timer = null;
		if (this.settings.players.number == 4)
			this.currentPlayer = this.yellow;
		this.start_date = new Date().toISOString();
		this.id = "0";
		/** @type {Number|null}*/this.tournament_id = null;
		/** @type {String|null}*/this.tournament_round = null;
		this.spareCountDown = 0;
		/** @type {Map<string, number>}*/ this.boardStateMap = new Map();
		this.cursor.square = this.currentPlayer.King;
	}
	/** @param {MatchSettings | string | null} preset*/
	Reset(preset=null)
	{
		let	w;
		let	h;
	
		if (!preset && !this.settings)
			this.settings = new MatchSettings(matchPresets.twoPlayer);
		else
			this.settings = new MatchSettings(preset);
		this.white = new Player(eTeam.White, this.settings);
		this.black = new Player(eTeam.Black, this.settings);
		this.red = new Player(eTeam.Red, this.settings);
		this.blue = new Player(eTeam.Blue, this.settings);
		this.green = new Player(eTeam.Green, this.settings);
		this.yellow = new Player(eTeam.Yellow, this.settings);
		this.users = [];
		w = this.settings.board.width;
		h = this.settings.board.heigth;
		this.board = new ChessBoard(w, h);
		this.cursor = new Cursor(w, h);
		this.moves = 0;
		this.boost = 0;
		this.history = new History(this.settings);
		this.historyCreateBool = false;
		this.currentPlayer = this.white;
		this.lastMenace = {from: "", mid: "", to: ""};
		this.boostPriority = new Set;
		this.playerNum = this.settings.players.number;
		this.lastLost = "";
		this.victory = "";
		/** @type {Timer | null} */ this.timer = null;
		if (this.settings.players.number == 4)
			this.currentPlayer = this.yellow;
		this.start_date = new Date().toISOString();
		this.id = "0";
		this.tournament_id = null;
		this.tournament_round = null;
		this.spareCountDown = 0;
		this.boardStateMap = new Map();
		this.cursor.square = this.currentPlayer.King;
	}
	endTurn()
	{
		/** @type {String} */ let	next = this.currentPlayer.next;

		// @ts-ignore
		if (!this.currentPlayer || !next || !this[next])
		{
			throw ("currentPlayer BUG");
		}
		// @ts-ignore
		this.currentPlayer = this[next];
	}
	forceWhiteTurn()
	{
		this.currentPlayer = this.white;
	}
	forceYellowTurn()
	{
		this.currentPlayer = this.yellow;
	}
	CheckOtherKingsDanger()
	{
		/** @type {Player} */let	player;
		/** @type {Square} */let	kingSquare;

		//@ts-ignore
		player = this[this.currentPlayer.next];
		while (player.team != this.currentPlayer.team)
		{
			kingSquare = this.board.get(player.King);
			if (isDangerous(this, kingSquare.dangerZones, player.team) == true)
				return (true);
			//@ts-ignore
			player = this[player.next];
		}
		return (false);
	}
	GetBoostedPieceCoords(considerCurrentPlayerBool=false, sortByPriorityBool=false)
	{
		/** @type {Player} */			let	player;
		/** @type {Square | undefined} */let	pieceSquare;
		/** @type {Array<string>} */let	arr = [];
		/** @type {Array<string>} */let	arrPriority;

		//@ts-ignore
		player = this[this.currentPlayer.next];
		while (player.team != this.currentPlayer.team)
		{
			pieceSquare = this.board._data.get(player.boostedPiece);
			if (!pieceSquare?.piece?.type)
			{
				//@ts-ignore
				player = this[player.next];
				continue ;
			}
			arr.push(player.boostedPiece);
			//@ts-ignore
			player = this[player.next];
		}
		if (considerCurrentPlayerBool && this.currentPlayer.boostedPiece)
			arr.push(this.currentPlayer.boostedPiece);
		if (arr.length == 0)
			return (null);
		if (sortByPriorityBool == false || arr.length == 1)
			return (arr);
		arrPriority = Array.from(this.boostPriority);
		arr.sort((coord1, coord2) =>
		{
			let piece1;
			let piece2;

			piece1 = this.board.get(coord1).piece;
			piece2 = this.board.get(coord2).piece;
			if (!piece1)
				return (-1);
			if (!piece2)
				return (1);
			//closure is used to remember the priority
			return (arrPriority.indexOf(piece1.team) - arrPriority.indexOf(piece2.team));			
		});
		return (arr);
	}
	/** 
	 * 
	 * @param {Result | null} result 
	 * */
	CheckMate(result=null)
	{
		console.log("haaaaaiiiiii viiiiiiintoooooooooo!!!!!!!");
		this.victory = this.currentPlayer.team;
		this.history.victory = this.victory;
		for (const user of this.users)
		{
			if (this.FindPlayer(user.team) == true)
				user.outcome = "Win";
		}
		if (this.id != "0")
			globals.matches.delete(this.id);
		if (result != null)
		{
			result.msg = "you win!";
			result.status = 200;
			result.victory = this.victory;
			result.specialMoves.SetCheckMate();
			//@ts-ignore
			// result.board = clientBoard(this);
		}
		else
			return (new Result());
		return (result);
	}
	/**
	 * 
	 * @param {Result | null} result 
	 * @param {Player} player 
	 */
	PlayerLost(result, player=this.currentPlayer)
	{
		this.lastLost = player.team;
		this.DeletePlayer(player);
		console.log(player.team, ":haaaaaiiiiii persoooooooooooooooooo!!!!!!!");
		// console.log("Premi un qualsiasi tasto per concludere...");
		//FIXME - gestire cosa succede in base a quanti player restano
		//FIXME - gestire salvataggio nella history
		this.history.Last().lastLost = player.team;
		if (result != null)
		{
			result.msg = "you lost!!!";
			result.status = 200;
			result.specialMoves.SetCheckMate();
			//@ts-ignore
			// result.board = clientBoard(this);
		}
		else
			return (new Result());
		return (result);	
	}
	/**
	 * 
	 * @param {Result | null} result 
	 */
	DrawMatch(result)
	{
		let player;
		let tmp;

		console.log("ed e' un pareggioooooooo!!!!");
		this.victory = "draw";
		// console.log("Premi un qualsiasi tasto per concludere...");
		//FIXME - gestire cosa succede in base a quanti player restano
		//FIXME - gestire salvataggio nella history
		tmp = this.currentPlayer;
		player = tmp.next;
		for (let x of this.users)
		{
			if (this.FindPlayer(x.team))
				x.outcome = "Draw";
		}
		//@ts-ignore
		while (this[player].team != tmp.team)
		{
			this.DeletePlayer(tmp);
			//@ts-ignore
			tmp = this[player];
			player = tmp.next;
		}
		this.DeletePlayer(tmp);
		//@ts-ignore
		tmp = this[player];
		player = tmp.next;
		if (result != null)
		{
			result.msg = "it's a spare!!!";
			result.status = 200;
			result.victory = this.victory;
			result.specialMoves.SetDraw();
			//@ts-ignore
			// result.board = clientBoard(this);
		}
		else
			return (new Result());
		return (result);	
	}
	/** @param {string} team */
	FindPlayer(team)
	{
		let	currTeam = this.currentPlayer.team;
		let	foundBool = false;

		do
		{
			if (team == this.currentPlayer.team)
				foundBool = true;
			this.endTurn();
		}
		while(this.currentPlayer.team != currTeam)
		return (foundBool);
	}
	/** @param {string} name */
	Log(name="")
	{
		return (this.history.Log(this, name));
	}
	/** @param {Player} player */
	DeletePlayer(player=this.currentPlayer)
	{
		let	boostedSquare;

		if (!player)
			throw (`Delete player: invalid player`);
		//@ts-ignore
		if (!this[player.team])
			throw (`Delete player: invalid player data`);
		this.playerNum--;
		if (!player.prev)
			return ;
		//@ts-ignore
		this[player.prev].next = player.next;
		//@ts-ignore
		this[player.next].prev = player.prev;
		if (!player.boostedPiece)
			return ;
		this.boostPriority.delete(player.team);
		//FIXME - qui va chiamato DangerUpdate. Farlo pero significa introdurre doppie inclusioni
		boostedSquare = this.board.get(player.boostedPiece);
		if (!boostedSquare.piece)
			throw (`DeletePlayer: invalid boosted piece in ${player.boostedPiece}`);
		boostedSquare.piece.isBoostedBool = false;
		DangerUpdate(this, player.boostedPiece);
	}
	/**
	 * 
	 * @param {function} func 
	 */
	ForEachTeam(func)
	{
		let	current;

		current = this.currentPlayer.team;
		do
		{
			func(arguments);
			this.currentPlayer = this.currentPlayer.next;
		}
		while (this.currentPlayer.team != current)
	}
	PlayerKingSquare()
	{
		return (this.board.get(this.currentPlayer.King));
	}
	/** @param {QueueNode} queueNode */
	CreateId(queueNode)
	{
		let userNames = "";
		let date;
		let id;

		for (let x of queueNode.userSet)
			userNames += x;
		date = Date.now().toString();
		id = date + userNames;
		console.log(`MatchId: ${id}`);
		this.id = id;
		return id;
	}
	getPieceNumber()
	{
		let total;
		let p;

		total = this.currentPlayer.nPieces;
		//@ts-ignore
		p = this[this.currentPlayer.next];
		while (p.team != this.currentPlayer.team)
		{
			total += p.nPieces;
			//@ts-ignore
			p = this[p.next];
		}
		return total;
	}
}

/**
 * timeout = puntatore alla funzione setTimeout
 * start = tempo in cui inizia il countdown
 * time = tempo limite del coutdown
 */
class Timer
{
	/** @param {number} time */
	/** @param {number} start */
	/** @param {NodeJS.Timeout | null} timeout */
	constructor(time=0, start=0, timeout= null)
	{
		this.timeout = timeout;
		this.start = start;
		this.time = time;
	}
}

class MatchSettings
{
	/** @param {MatchSettings | string | null} other */
	constructor(other=null)
	{
		if (other == "0")
			other = null;
		if (typeof(other) == "string")
			other = this.GetPresetByType(other);
		this.timer = MATCHTIMER;
		this.board =
		{
			width: CHESSBOARD_W,
			heigth: CHESSBOARD_H,
			seed: 0,
			start: "",
			corners: false
		}
		this.players =
		{
			number: 2,
			startPoints: 0,
			teams:
			{
				white: "",
				black: "",
				yellow: "",
				red: "",
				blue: "",
				green: ""
			}
		}
		/** @type {string | null} */
		this.presetType = null;
		if (!other)
			return ;
		this.CopyConstructor(other);
	}
	/** @param {MatchSettings} other */
	CopyConstructor(other)
	{
		if (other.board)
			this.board = structuredClone(other.board);
		if (other.players)
			this.players = structuredClone(other.players);
		this.presetType = other.presetType;
		this.timer = other.timer;
	}
	/** @param {string} matchPresetType */
	GetPresetByType(matchPresetType)
	{
		switch (matchPresetType)
		{
			case (eMatchPresets.ClassicTwoPlayers):
				return (new MatchSettings(matchPresets.twoPlayer));
			case (eMatchPresets.ClassicFourPlayers):
				return (new MatchSettings(matchPresets.fourPlayerWalls));
			case (eMatchPresets.ClassicFreeForAll):
				return (new MatchSettings(matchPresets.fourPlayerWalls));
			case (eMatchPresets.NoCornersFourPlayers):
				return (new MatchSettings(matchPresets.fourPlayer));
			default:
				throw (`MatchSettings: invalid preset name "${matchPresetType}"`);
		}
	}
}

const matchPresets =
{
	twoPlayer: new MatchSettings(),
	fourPlayer: new MatchSettings(),
	fourPlayerWalls: new MatchSettings()
}
matchPresets.twoPlayer.presetType = eMatchPresets.ClassicTwoPlayers;
matchPresets.fourPlayer.presetType = eMatchPresets.ClassicFourPlayers;
matchPresets.fourPlayer.board.width = 14;
matchPresets.fourPlayer.board.heigth = 14;
matchPresets.fourPlayer.players.number = 4;
matchPresets.fourPlayerWalls = structuredClone(matchPresets.fourPlayer);
matchPresets.fourPlayerWalls.board.corners = true;
matchPresets.fourPlayerWalls.presetType = eMatchPresets.NoCornersFourPlayers;

export {Match, Timer, MatchSettings, matchPresets};
