const eSpecialMoves =
{
    NONE: 0,
    CASTLING: 1 << 0,
    TRANSFIGURATION: 1 << 1,
    ENDGAME: 1 << 2,
    CHECK: 1 << 3,
    CHECKMATE: 1 << 4
}

const	eRoomType = 
{
	PRIVATE: 'private',
	FRIENDLY: 'friendly',
	RANKED: 'ranked',
	ARENA: 'arena'	
}

const	eMatchPresets =
{
	"1v1" : 		"1v1",
	"2v2" : 		"2v2",
	"FreeForAll" :	"1v1v1v1",
	// NoCornersFourPlayers: "14x14x4",
}

export { eRoomType, eMatchPresets, eSpecialMoves }