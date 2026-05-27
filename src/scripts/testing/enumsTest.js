export const colors = {
  // Reset
	reset: "\x1b[0m",

	// Testo
	black:   "\x1b[30m",
	red:     "\x1b[31m",
	green:   "\x1b[32m",
	yellow:  "\x1b[33m",
	blue:    "\x1b[34m",
	magenta: "\x1b[35m",
	cyan:    "\x1b[36m",
	white:   "\x1b[37m",

	// Testo bright
	brightRed:     "\x1b[91m",
	brightGreen:   "\x1b[92m",
	brightYellow:  "\x1b[93m",
	brightBlue:    "\x1b[94m",
	brightMagenta: "\x1b[95m",
	brightCyan:    "\x1b[96m",
	brightWhite:   "\x1b[97m",

	// Sfondo
	bgBlack:   "\x1b[40m",
	bgRed:     "\x1b[41m",
	bgGreen:   "\x1b[42m",
	bgYellow:  "\x1b[43m",
	bgBlue:    "\x1b[44m",
	bgMagenta: "\x1b[45m",
	bgCyan:    "\x1b[46m",
	bgWhite:   "\x1b[47m",

	// Stile
	bold:      "\x1b[1m",
	underline: "\x1b[4m",
	dim:       "\x1b[2m",
};

export const testerEnum = 
{
	//SECTION - RESULT
	RESULT_OK: `${colors.green}[OK]${colors.reset}`,
	RESULT_FAIL: `${colors.red}[KO]${colors.reset}`,
	RESULT_ERROR: `${colors.yellow}[ERROR]${colors.reset}`,
	//SECTION - testerErrors: problems caused by the tester program
	INVALID_ARGV: "The tester did not receive the param",
	INVALID_DIR: "Please give the tester only the file names",
	INVALID_PATH: "The path $1 is not valid",
	INVALID_JSON: "The test JSON is missing some core data",
	INVALID_MSG: "Some of these message got broken",
	//SECTION - programErrors: problems caused by alerusso, mbiagi or edraccan
	WIN_WRONG: "No player should have won",
	WIN_MISS: "The player $1 should have won",
	WIN_PLAYER: "Wrong winner: the player $1 should have won",
	BOARD: "Board does not match\nCorrect:\n$1Wrong:\n$2"
}