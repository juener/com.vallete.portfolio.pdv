import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'
import { execSync } from 'child_process'

const prisma = new PrismaClient()

function generateRandomDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL from .env was not found.')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', randomUUID())

  return url.toString()
}

const databaseUrl = generateRandomDatabase()

beforeAll(async () => {
  process.env.DATABASE_URL = databaseUrl

  execSync('npx prisma migrate dev')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${databaseUrl}" CASCADE`,
  )
  await prisma.$disconnect()
})
