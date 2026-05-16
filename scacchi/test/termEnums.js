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

module.exports = {cmd};