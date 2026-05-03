// lib/prisma.js
let prisma;

async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import('../generated/prisma/client.js');
    prisma = new PrismaClient();
  }
  return prisma;
}

module.exports = { getPrisma };