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

//SECTION - checkMateCheck

	for (let x of kingSquare.dangerZones)
	{
		if (match.board.get(x).piece?.team != team)
		{
			enemySquare = x;
			threat.add(enemySquare);
		}
	}

	if (enemySet.has(enemyCoord) && enemySet.has(kingCoord))
		enemySet.delete(enemyCoord);
	if (isDangerous(match, enemySet, team) && enemySet.has(kingCoord))
		enemySet?.delete(kingCoord);	



//SECTION - gamelogic

/**
 * 
 * @param {Match} match 
 * @param {Square} square
 * @param {string} pos
 */
function RefreshChampion(match, square, pos)
{
	for (const zone of square.targetZones)
		match.board.get(zone).dangerZones.delete(pos)
	for (const [key, value] of square.boostedTargetZones)
	{
		for (const coord of value)
			match.board.get(coord).dangerZones.delete(pos)
		match.board.get(key).dangerZones.delete(pos)
	}
	DangerUpdate(match, pos);
}

/**
 * 
 * @param {Array<String>} coords
 * @param {Match} match
 * @param {Result} result
 * @returns 
 */
function simulation(coords, match, result)
{
	let tmpPiece = null;
	let tmpSquare = null;
	let	from;
	let	to;
	let	king;
	let	dangerBool;
	let boosted;

	from = match.board.get(coords[0]);
	to = match.board.get(coords[1]);
	king = match.board.get(match.currentPlayer.King);
	if (!from || !to || !king)
		throw (`simulation: invalid from: ${from}/to: ${to}/king: ${king}`);
	if (to.piece)
	{
		tmpSquare = to.Copy();
		tmpPiece = tmpSquare.piece;
	}
	if (result.specialMoves.CheckSniperMove() == 0)
	{
		to.piece = from.piece;
		from.piece = null;
	}
	else
		to.piece = null;
	if (coords[0] == match.currentPlayer.King)
		king = to;
	dangerUpdateMoved(match, coords, result);
	dangerBool = isDangerous(match, king.dangerZones, king.piece?.team);
	if (!dangerBool)
		dangerBool = checkDoubleMoveMate(match, coords, result);
	if (result.specialMoves.CheckSniperMove() == 0)
	{
		from.piece = to.piece;
		to.piece = tmpPiece;
	}
	else
		to.piece = tmpPiece;
	dangerUpdateMoved(match, [coords[1], coords[0]], result);
	if (tmpSquare)
		match.board.set(coords[1], tmpSquare);
	boosted = match.GetOBoostedPieceCoords();
	for (const coord of match.board.updates)
		DangerUpdate(match, coord);
	if (!boosted)
		return (!dangerBool);
	for (const p of boosted)
	{
		if (match.board.get(p).piece?.type == enumNames.CHAMPION && match.board.updates.has(p))
			RefreshChampion(match, match.board.get(p), p);
	}
	// DangerUpdate(match, coords[0]);
	return (!dangerBool);
}

//NOTE - versione buggosa di Ale :-(
//NOTE - per bro Marco: come fa a funzionare senza considerare le boosted?
//NOTE - sei un pazzo fortissimo
/**
 * Checks if we can put a piece to protect the king from the danger
 * @param {Match} match
 * @param {string} kingSquare 
 * @param {string} enemySquareString 
 * @param {boolean} recBool
 * @param {Square | null} enemySquare
 * @returns {boolean} 
 */
function isStoppable(match, kingSquare, enemySquareString, recBool=true, enemySquare=null)
{
	let	square;
	let	enemyPiece;
	let	guardianPiece;

	if (!enemySquare)
		enemySquare = match.board.get(enemySquareString);
	enemyPiece = enemySquare.piece;
	if (!enemyPiece)
		throw (`isStoppable: invalid piece in ${enemySquareString}`); 
	if (enemyPiece?.type == enumNames.JESTER || 
	enemyPiece?.type == enumNames.BASTARDS || 
	(enemyPiece?.type == enumNames.VALKIRYA && 
	enemyPiece?.isBoostedBool == true) ||
	match.board.get(kingSquare)?.targetZones.has(enemySquareString))
		return false;
	let dir = getDirection(match, kingSquare, enemySquareString);
	// match.cursor.setCursor(match.cursor.getRow() + dir.diffRow, match.cursor.getCol() + dir.diffCol);
	if (!movePiece(match, dir.diffCol, dir.diffRow))
		return true;
	while (match.board.get(match.cursor.square).piece?.type != enumNames.KING)
	{
		square = match.board.get(match.cursor.square);
		if (!square || !square.dangerZones)
			continue ;
		for (let x of square.dangerZones)
		{
			if (x == kingSquare)
				continue ;
			guardianPiece = match.board.get(x).piece;
			if (!guardianPiece)
				throw (`isStoppable: invalid guardian in ${enemySquareString}`);
			if (guardianPiece.team != match.board.get(kingSquare).piece?.team)
				continue ;
			if (guardianPiece.type == enumNames.BASTARDS && match.cursor.IsOblique(x))
				continue ;
			// if (recBool == false)
			// 	return true;
			// if (enemyPiece.multipleMovesBool == false)
			// 	return true;
			// for (const [secondCoord] of enemySquare.boostedTargetZones)
			// 	if (isStoppable(match, kingSquare, secondCoord, false, enemySquare) == false)
			// 		return false;
			return true;
		}
		if (!movePiece(match, dir.diffCol, dir.diffRow))
			return true;
	}
	return false;
}