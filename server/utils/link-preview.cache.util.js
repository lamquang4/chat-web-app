const CACHE_TTL_MS = 30 * 60 * 1000;
const NEGATIVE_CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_MAX_SIZE = 500;

const cache = new Map();

const cacheGet = (key) => {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt < Date.now()) {
    cache.delete(key);
    return undefined;
  }
  return entry.value;
};

const cacheSet = (key, value, ttl) => {
  if (cache.size >= CACHE_MAX_SIZE) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
  cache.set(key, { value, expiresAt: Date.now() + ttl });
};

module.exports = {
  CACHE_TTL_MS,
  NEGATIVE_CACHE_TTL_MS,
  cacheGet,
  cacheSet,
};
