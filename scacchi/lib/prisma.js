
import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
// import dotenv from "dotenv";
import { log } from "../utils/log.js";
import { loadSecretsFromVault } from './vault.js';

await loadSecretsFromVault();

dotenv.config();
log.header('ft_transcendence', '1.0.0');

log.db("Setting up Prisma client...");

/** @type { PrismaClient } */
const prisma = global.prisma ?? new PrismaClient(
  {adapter: new PrismaPg( { connectionString: process.env.DATABASE_URL } )}
);

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

log.ok("Prisma client has been set up");

export { prisma };
