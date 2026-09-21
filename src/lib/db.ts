import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { existsSync } from 'fs'

function generateApiKey(): string {
  const bytes = randomBytes(24).toString('hex')
  return `ss_live_${bytes}`
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  dbInitialized: boolean | undefined
}

/**
 * Resolve the SQLite URL explicitly.
 * Prisma's generated client loads .env files discovered relative to its own
 * directory at runtime — in a standalone/Vercel build that can pick up a
 * stale path from a different machine (e.g. file:/home/z/...). Any absolute
 * file: URL that does not exist falls back to a writable /tmp location so
 * auth works out of the box on Vercel cold starts (tables + seed user are
 * created lazily by initializeDatabase below).
 */
function resolveDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL
  if (!url) return 'file:/tmp/scrapesuite.db'
  if (url.startsWith('file:')) {
    const filePath = url.slice(5)
    if (filePath.startsWith('/') && !existsSync(filePath)) {
      return 'file:/tmp/scrapesuite.db'
    }
    return url
  }
  return url // postgres/mysql/etc — pass through untouched
}

// Create Prisma client with optimized settings for serverless
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
    datasourceUrl: resolveDatabaseUrl(),
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Initialize database - create tables and seed admin user if needed
// Uses Prisma-compatible SQLite schema (DateTime stored as TEXT in ISO format)
export async function initializeDatabase() {
  if (globalForPrisma.dbInitialized) return

  try {
    // Create tables if they don't exist - matching Prisma's SQLite conventions
    // Prisma stores DateTime as TEXT (ISO 8601 format) and uses TEXT for IDs
    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS User (
        id TEXT PRIMARY KEY NOT NULL,
        email TEXT NOT NULL UNIQUE,
        name TEXT,
        passwordHash TEXT NOT NULL,
        plan TEXT NOT NULL DEFAULT 'free',
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS ApiKey (
        id TEXT PRIMARY KEY NOT NULL,
        key TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL DEFAULT 'Default Key',
        userId TEXT NOT NULL,
        lastUsed DATETIME,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `)

    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS ScrapeHistory (
        id TEXT PRIMARY KEY NOT NULL,
        userId TEXT NOT NULL,
        url TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'success',
        result TEXT NOT NULL,
        creditsUsed INTEGER NOT NULL DEFAULT 1,
        responseMs INTEGER NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `)

    await db.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS Subscription (
        id TEXT PRIMARY KEY NOT NULL,
        userId TEXT NOT NULL UNIQUE,
        paystackCode TEXT,
        paystackEmail TEXT,
        plan TEXT NOT NULL DEFAULT 'free',
        status TEXT NOT NULL DEFAULT 'active',
        currentPeriodEnd DATETIME,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `)

    await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS ApiKey_userId_idx ON ApiKey(userId)`)
    await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS ScrapeHistory_userId_idx ON ScrapeHistory(userId)`)
    await db.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS Subscription_userId_idx ON Subscription(userId)`)

    console.log('[DB] Tables verified/created')

    // Seed admin user if not exists
    const adminUser = await db.user.findUnique({ where: { email: 'admin@scrapesuite.com' } })

    if (!adminUser) {
      console.log('[DB] Seeding admin user...')
      // Cost 10 keeps cold-start seeding fast on serverless (~100ms vs ~300ms
      // for cost 12) while still being appropriate for the seeded demo account.
      const passwordHash = await bcrypt.hash('Scrape2026!', 10)

      await db.user.create({
        data: {
          email: 'admin@scrapesuite.com',
          name: 'Admin',
          passwordHash,
          plan: 'free',
          apiKeys: {
            create: {
              name: 'Default Key',
              key: generateApiKey(),
            },
          },
        },
      })

      console.log('[DB] Admin user seeded successfully')
    }

    // Mark initialized only AFTER all DDL + seeding succeeded, so a failed
    // init (e.g. transient SQLite lock on a cold instance) is retried on the
    // next request instead of permanently bricking this lambda instance.
    globalForPrisma.dbInitialized = true
  } catch (error) {
    console.error('[DB] Initialization error:', error)
    // Allow retry on the next request - do not leave the flag set.
    globalForPrisma.dbInitialized = false
    // Don't throw - subsequent queries might still work if tables exist from a previous cold start
  }
}
