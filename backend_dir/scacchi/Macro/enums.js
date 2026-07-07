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
	MoveBoost: 'moveboost',
	Boost: 'boost',
	EndTurn: `endturn`,
	Transform: 'trans'
};

const eMatchPresets =
{
	ClassicTwoPlayers: "1v1",
	ClassicFourPlayers: "2v2", //TODO - da implementare
	ClassicFreeForAll: "1v1v1v1",
	NoCornersFourPlayers: "14x14x4",
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

const enumConnection = 
{
	PRIVATE: 'private',
	FRIENDLY: 'friendly',
	RANKED: 'ranked',
	ARENA: 'arena'
};

const enumSocketState =
{
	MATCHMAKING: "matchMaking",
	PLAYING: "playing",
	WATCHING: "watching"
};

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
	CHECKMATE: 1 << 4,
	SNIPER: 1 << 5,
	ISBASTARD: 1 << 6,
	EATENBASTARD: 1 << 7,
	CHAMPIONBOOST: 1 << 8,
	DRAW: 1 << 9,
}

const kingMovements = 
[
	{dx:1, dy:1}, {dx:-1, dy:-1},//obliquo
	{dx:-1, dy:1}, {dx:1, dy:-1},
	{dx:0, dy:1}, {dx:0, dy:-1},//verticale
	{dx:1, dy:0}, {dx:-1, dy:0},//orizzontale
];

export {eTeam, eEvents, eMatchPresets, enumNames, arrayNames, enumInitNames, enumValues, enumSpecialMoves, kingMovements, enumConnection, enumSocketState};