
const { prisma } = require("../lib/prisma.js");
const lib = require("../lib/lib.js");

const getAllPieces = async () => {
	return await prisma.pieces.findMany({
		select: {
			id_piece: true,
			name: true,
			cost: true,
			image: true,
			movement: true,
			info: true,
			lore: true,
			abilities: {
				select: {
					id_ability: true,
					name: true,
					description: true,
					image: true
				}
			}
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
			image: true,
			movement: true,
			info: true,
			lore: true,
			abilities: {
				select: {
					id_ability: true,
					name: true,
					description: true,
					image: true
				}
			}
		}
	});
}

module.exports = { getAllPieces, getPieceById };