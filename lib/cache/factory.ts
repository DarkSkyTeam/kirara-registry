import { CacheBackend } from "./types"
import { VercelDataCache } from "./vercel"

export function createCacheBackend(): CacheBackend {
  return new VercelDataCache()
} 