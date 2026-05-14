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

module.exports = {eTeam, eEvents, enumNames, enumValues};