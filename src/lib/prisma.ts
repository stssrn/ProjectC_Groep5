// https://github.com/vercel/examples/blob/97d67b57810c7a8bdc6531c8bf38d9e50ac5b24c/storage/postgres-prisma/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') global.prisma = prisma

export default prisma
