// @ts-check

/**
 * 
 * @param {*} match
 * @param {Set<string> | undefined} setZones dangerZone to check
 * @param {string | undefined} team enumTeam to the piece to check
 */
let isDangerous = (match, setZones, team) =>
{
	let	board;

	board = match.board;
	if (setZones == undefined)
		return false;
	for (let x of setZones)
	{
		if (team == undefined)
			return (true);
		if (match.board.get(x)?.piece?.team != team)
			return (true);
	}
	return false;
}

/*										dy/dx	dy/dx	dy/dx
	red/white: SOUTH, dy positivo  -->	1, 0	1,-1	1,1
	yellow/black: NORTH dy negativo		-1, 0	-1,-1	-1,1
	blue: WEST dx positivo				0, 1	-1,1	1,1
	green: EAST dx positivo				0, -1	-1,-1	1,-1
*/
let bastardMove = // aggiornato movimenti
{
	white: new Set(["1|0", "1|1", "1|-1"]),
	red: new Set(["1|0", "1|1", "1|-1"]),
	black: new Set(["-1|0", "-1|-1", "-1|1"]),
	yellow: new Set(["-1|0", "-1|-1", "-1|1"]),
	blue: new Set(["0|1", "-1|1", "1|1"]),
	green: new Set(["0|-1", "-1|-1", "1|-1"])
}

/**
 * 
 * @param {*} match
 * @param {Number} dy
 * @param {Number} dx
 * @param {*} piece
 */
function bastardChecks(match, dy, dx, piece)
{
	let tmp;
	let	target;

	if (piece.type != "Bastards")
		return true;
	//@ts-ignore
	if (!bastardMove[piece.team]) // FIXME errore grave: impossibile
		return false;
	// @ts-ignore
	if (!bastardMove[piece.team].has(`${dy}|${dx}`))
		return false;
	tmp = match.cursor.square;
	match.cursor.moveRow(dy);
	match.cursor.moveCol(dx);
	target = match.board.get(match.cursor.square)?.piece;
	match.cursor.set(tmp);
	if (dx != 0 && dy != 0)//NOTE - bastards moves diagonally
	{
		if (!target || target.team == piece.team)
			return (false);
		return (true);
	}
	else if (target)//NOTE - bastards moves front
		return (false);
	match.cursor.moveRow(dy + dy);
	match.cursor.moveCol(dx + dx);
	if (!piece.isMovedBool && !match.board.get(match.cursor.square).piece)
	{
		match.board.get(tmp).targetZones.add(match.cursor.square);
		match.board.get(match.cursor.square).dangerZones.add(tmp);
	}
	match.cursor.set(tmp);
	return (true);
}

module.exports = {bastardChecks, isDangerous};