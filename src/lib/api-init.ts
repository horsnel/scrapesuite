import { initializeDatabase } from '@/lib/db'

// Ensures database is initialized before handling API requests
// Call this at the start of every API route handler
let initPromise: Promise<void> | null = null

export async function ensureDbInit() {
  if (!initPromise) {
    initPromise = initializeDatabase()
  }
  return initPromise
}
