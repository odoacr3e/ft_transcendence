//@ts-check

/**
 * 
 * @param {Match} match
 * @param {string} pos
 * @param {string} dest
 * @param {Result | null} result
 * @param {boolean} updateBool
 */
function dangerDelPiece(match, pos=match.cursor.square, dest, result=null, updateBool=true)
{
	let	pieceSquare;
	let tmp;

	pieceSquare = match.board.get(pos);
	for (const target of pieceSquare.targetZones)
	{
		match.board.get(target).dangerZones.delete(pos);
		if (target != dest)
			DangerUpdate(match, target, updateBool);
	}
	if (result && result.specialMoves.CheckBastardMove())
	{
		match.cursor.Save();
		match.cursor.set(pos);
		for (const move of kingMovements)
		{
			movePiece(match, move.dy, move.dx);
			match.board.get(match.cursor.square).dangerZones.delete(pos);
			match.cursor.set(pos);
		}
		match.cursor.Restore();
	}
	for (const [key, set] of pieceSquare.boostedTargetZones)
	{
		for (const target of set)
		{
			match.board.get(target).dangerZones.delete(pos);
			// DangerUpdate(match, target);
		}
	}
	tmp = new Set(pieceSquare.dangerZones);
	pieceSquare.dangerZones.clear();
	for (const target of tmp)
	{
		if (!result || result.specialMoves.CheckSniperMove() == 0)
		{
			if (target != dest)
				DangerUpdate(match, target, updateBool);
		}
		// if (pos == null)
		// 	throw ("DEBUG throw dangerZones");
		// match.board.updates.add(target);
	}
	CheckInfluence(match, pos);
	pieceSquare.targetZones.clear();
	pieceSquare.boostedTargetZones.clear();
	// pieceSquare.ClearZones();
	if (pos == null)
		throw ("DEBUG throw REMOVE");
	match.board.updates.add(pos);
}

/**
 * 
 * @param {Match} match
 * @param {string} pos
 * @param {Result | null} result
 */
function dangerUpPiece(match, pos=match.cursor.square, result=null)
{
	let	pieceSquare;
	let tmpSet;

	pieceSquare = match.board.get(pos);
	tmpSet = new Set(pieceSquare.dangerZones);
	for (const target of pieceSquare.targetZones)
	{
		match.board.get(target).dangerZones.delete(pos);
		// DangerUpdate(match, target);
	}
	if (result && (result.specialMoves.CheckBastardMove() || result.specialMoves.CheckEatenBastard()))
	{
		match.cursor.Save();
		match.cursor.set(pos);
		for (const move of kingMovements)
		{
			movePiece(match, move.dy, move.dx);
			match.board.get(match.cursor.square).dangerZones.delete(pos);	
			match.cursor.set(pos);
		}
		match.cursor.Restore();
	}
	for (const [key, set] of pieceSquare.boostedTargetZones)
	{
		for (const target of set)
		{
			match.board.get(target).dangerZones.delete(pos);
			// DangerUpdate(match, target);
		}
	}
	for (const target of tmpSet)
	{
		// if (!result || result.specialMoves.CheckSniperMove() == 0)
		// {
			// dangerDelPiece(match, target, pos, result, false);
		// }
		DangerUpdate(match, target);
		// if (pos == null)
		// 	throw ("DEBUG throw dangerZones");
		// match.board.updates.add(target);
	}
	CheckInfluence(match, pos);
	pieceSquare.targetZones.clear();
	pieceSquare.boostedTargetZones.clear();
	// pieceSquare.ClearZones();
	if (pos == null)
		throw ("DEBUG throw REMOVE");
	match.board.updates.add(pos);
}