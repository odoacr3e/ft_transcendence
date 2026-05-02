
const { PrismaClient } = require('../generated/prisma')
// require('dotenv').config()

const prisma = global.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

module.exports = { prisma }