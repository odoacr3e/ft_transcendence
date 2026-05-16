const color = require("../utils/colors").colors;

const cmd = 
{
	UP: "up",
	W: "up",
	DOWN: "down",
	S: "down",
	LEFT: "left",
	A: "left",
	RIGHT: "right",
	D: "d",
	MOVEMENTS: [],
	TARGET_DANGER_SWITCH: "r",
	END_TURN: "e",
	BUY_BOOST: "q",
	USE_BOOST: "t",
	MOVE: "space",
	LOAD_HISTORY: "p",
	HELP: "h"
};

cmd.MOVEMENTS = [cmd.LEFT, cmd.RIGHT, cmd.UP, cmd.DOWN, cmd.W, cmd.A, cmd.S, cmd.D];

const testerEnum = 
{
	//SECTION - RESULT
	RESULT_OK: `${color.green}[OK]${color.reset}`,
	RESULT_FAIL: `${color.red}[KO]${color.reset}`,
	RESULT_ERROR: `${color.yellow}[ERROR]${color.reset}`,
	//SECTION - testerErrors: problems caused by the tester program
	INVALID_ARGV: "The tester did not receive the param",
	INVALID_DIR: "Please give the tester only the file names",
	INVALID_PATH: "The path $1 is not valid",
	INVALID_JSON: "The test JSON is missing some core data",
	INVALID_MSG: "Some of these message got broken",
	//SECTION - programErrors: problems caused by alerusso, mbiagi or edraccan
	WIN_WRONG: "No player should NOT have won",
	WIN_MISS: "The player $1 should have won",
	WIN_PLAYER: "Wrong winner: the player $1 should have won",
	BOARD: "Board does not match\nCorrect:\n$1Wrong:\n$2"
}

module.exports = {cmd, testerEnum};