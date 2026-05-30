
import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

/** @type { PrismaClient } */
const prisma = global.prisma ?? new PrismaClient(
  {adapter: new PrismaPg( { connectionString: process.env.DATABASE_URL } )}
);

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export { prisma };
