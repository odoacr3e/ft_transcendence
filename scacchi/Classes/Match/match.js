// @ts-check
import fs from "fs";

import {Cursor} from "./cursor.js";
import {eTeam, eEvents, enumNames} from "../../Macro/enums.js";
import {Square, initBoard, copyBoard, copyBoostedTargetZones, ChessBoard} from "../ChessBoard/chessBoard.js";
import {HISTORY_PATH, CHESSBOARD_W, CHESSBOARD_H} from "../../Macro/macro.js";
import {Result} from "../endPoint/result.js";
import {Player} from "./player.js";
import {boardStringify} from "../../test/render.js";
import { isDangerous } from "../../utils/gameUtils.js";
import { History } from "./history.js";
import { clientBoard } from "../../handlers/game/utils.js";

class Match
{

	/** @param {MatchSettings | null} preset*/
	constructor(w=8, h=8, preset=null)
	{
		if (preset)//FIXME - da togliere
		{
			w = preset.board.width;
			h = preset.board.heigth;
		}
		this.white = new Player(eTeam.White);
		this.black = new Player(eTeam.Black);
		this.red = new Player(eTeam.Red);
		this.blue = new Player(eTeam.Blue);
		this.green = new Player(eTeam.Green);
		this.yellow = new Player(eTeam.Yellow);
		this.board = new ChessBoard(w, h);
		this.cursor = new Cursor(w, h);
		this.moves = 0;
		this.boost = 0;
		this.history = new History(preset);
		this.historyCreateBool = false;
		this.currentPlayer = this.white;
		this.playerNum = 2;
		this.victory = "";
		this.settings = preset;
		/** @type {Timer | null} */ this.timer = null;

		if (preset?.players.number == 4)
			this.currentPlayer = this.yellow;
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
	GetOBoostedPieceCoords()
	{
		/** @type {Player} */			let	player;
		/** @type {Square | undefined} */let	pieceSquare;
		/** @type {Array<string>} */let	arr = [];

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
		if (arr.length == 0)
			return (null);
		return (arr);
	}
	/** @param {Result | null} result */
	CheckMate(result=null)
	{
		console.log("haaaaaiiiiii viiiiiiintoooooooooo!!!!!!!");
		console.log("Premi un qualsiasi tasto per concludere...");
		this.victory = this.currentPlayer.team;
		this.history.victory = this.victory;
		if (result != null)
		{
			result.msg = "you win!";
			result.status = 200;
			result.youWin = true;
			result.specialMoves.SetCheckMate();
			//@ts-ignore
			result.board = clientBoard(this);
		}
		else
			return (new Result());
		return (result);
	}
	/**
	 * 
	 * @param {Result} result 
	 * @param {string} team 
	 */
	PlayerLost(result, team)
	{
		console.log("haaaaaiiiiii persoooooooooooooooooo!!!!!!!");
		console.log("Premi un qualsiasi tasto per concludere...");
		//FIXME - gestire cosa succede in base a quanti player restano
		//FIXME - gestire salvataggio nella history
		this.victory = this[team].next;
		this.history.victory = this[team].next;
		if (result != null)
		{
			result.msg = "you win!";
			result.status = 200;
			result.youWin = true;
			result.specialMoves.SetCheckMate();
			//@ts-ignore
			result.board = clientBoard(this);
		}
		else
			return (new Result());
		return (result);	
	}
	/** @param {MatchSettings | null} preset*/
	Reset(w=CHESSBOARD_W, h=CHESSBOARD_H, preset=null)
	{
		if (preset)//FIXME - da togliere
		{
			w = preset.board.width;
			h = preset.board.heigth;
		}
		this.white = new Player(eTeam.White);
		this.black = new Player(eTeam.Black);
		this.red = new Player(eTeam.Red);
		this.blue = new Player(eTeam.Blue);
		this.green = new Player(eTeam.Green);
		this.yellow = new Player(eTeam.Yellow);
		this.board = new ChessBoard(w, h);
		this.cursor = new Cursor(w, h);
		this.moves = 0;
		this.boost = 0;
		this.history = new History(preset);
		this.currentPlayer = this.white;
		this.victory = "";
		if (preset)
			this.settings = structuredClone(preset);
		if (this.settings?.players.number == 4)
			this.currentPlayer = this.yellow;
	}
	/** @param {string} name */
	Log(name)
	{
		this.history.Log(this, name);
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
	/** @param {MatchSettings | null} other */
	constructor(other=null)
	{
		this.board =
		{
			width: CHESSBOARD_W,
			heigth: CHESSBOARD_H,
			seed: 0,
			start: ""
		}
		this.players =
		{
			number: 2,
			startPoints: 42,
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
	}
}

const matchPresets =
{
	twoPlayer: new MatchSettings(),
	fourPlayer: new MatchSettings(),
}
matchPresets.fourPlayer.board.width = 14;
matchPresets.fourPlayer.board.heigth = 14;
matchPresets.fourPlayer.players.number = 4;

export {Match, Timer, MatchSettings, matchPresets};
