import { initializeDatabase } from '@/lib/db'

// Ensures database is initialized before handling API routes.
// The promise is cached per lambda instance; on failure it is cleared so the
// next request retries (a transient cold-start error must not permanently
// brick the instance).
let initPromise: Promise<void> | null = null

export async function ensureDbInit(): Promise<void> {
  if (!initPromise) {
    initPromise = initializeDatabase().catch((error) => {
      initPromise = null
      throw error
    })
  }
  try {
    await initPromise
  } catch {
    // initializeDatabase already logs and swallows its own errors; reaching
    // here means something unexpected - continue so callers can proceed.
  }
}
