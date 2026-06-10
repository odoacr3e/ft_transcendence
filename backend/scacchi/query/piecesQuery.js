
import * as lib from "../lib/lib.js";
const { prisma } = lib.conn;

const getAllPieces = async () => {
	return await prisma.pieces.findMany({
		select: {
			id_piece: true,
			name: true,
			cost: true,
			info: true,
			lore: true,
			abilities: {
				select: {
					id_ability: true,
					name: true,
					description: true
				}
			}
		},
		orderBy: {
			id_piece: 'asc'
		}
	});
}

const findPieceByName = async (name) => {
	return await prisma.pieces.findMany({
		select: {
			id_piece: true,
			name: true,
			cost: true,
			info: true,
			lore: true,
			abilities: {
				select: {
					id_ability: true,
					name: true,
					description: true
				}
			}
		},
		where: {
			name: {
				contains: String(name),
				mode: 'insensitive'
			}
		},
		orderBy: {
			id_piece: 'asc'
		}
	});
}

const getPieceById = async (id) => {
	return await prisma.pieces.findUnique({
		where: {
			id_piece: Number(id)
		}, 
		select: {
			id_piece: true,
			name: true,
			cost: true,
			info: true,
			lore: true,
			abilities: {
				select: {
					id_ability: true,
					name: true,
					description: true
				}
			}
		},
		orderBy: {
			id_piece: 'asc'
		}
	});
}

export { getAllPieces, findPieceByName, getPieceById };