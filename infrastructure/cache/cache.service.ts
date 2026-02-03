export class CacheService {
  async get(key: string) {}
  async set(key: string, value: unknown) {}
  async invalidate(key: string) {}
}

export const cacheService = new CacheService()
