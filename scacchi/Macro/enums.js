// @ts-check

/**
 * @enum {string}
 */
const eTeam = 
{
	Black: 'black',
	White: 'white',
	Red: 'red',
	Blue: 'blue',
	Green: 'green',
	Yellow: 'yellow',
};

const eEvents = 
{
	Move: 'move',
	Boost: 'boost',
	EndTurn: `endTurn`
};

/**
 * @enum {number}
 */
const enumValues = {
	KING: 0,
	CHAMPION: 10,
	MINOTAURUS: 5,
	JESTER: 5,
	VALKIRYA: 3,
	BASTARDS: 1
};

/**
 * @enum {string}
 */
const enumNames = {
	KING: 'King',
	CHAMPION: 'Champion',
	MINOTAURUS: 'Minotaurus',
	JESTER: 'Jester',
	VALKIRYA: 'Valkirya',
	BASTARDS: 'Bastards',
	MAGE: 'Mage',
	GHOUL: 'Ghoul'
};

const arrayNames = Object.values(enumNames);

const enumInitNames = 
{
	KING: 'K',
	CHAMPION: 'C',
	MINOTAURUS: 'M',
	JESTER: 'J',
	VALKIRYA: 'V',
	BASTARDS: 'B',
	MAGE: 'W',
	GHOUL: 'G'
};


const enumSpecialMoves =
{
	NONE: 0,
	CASTLING: 1 << 0,
	TRANSFIGURATION: 1 << 1,
	ENDGAME: 1 << 2,
	CHECK: 1 << 3,
	CHECKMATE: 1 << 4
}

module.exports = {eTeam, eEvents, enumNames, arrayNames, enumInitNames, enumValues, enumSpecialMoves};