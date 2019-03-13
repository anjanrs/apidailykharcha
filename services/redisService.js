const redis = require("redis");
const config = require("../config");
const util = require("util");

class RedisService {
  constructor() {
    this.redisClient = redis.createClient(config.redisUrl);
  }

  async get(key) {
    this.redisClient.get = util.promisify(this.redisClient.get);
    const cachedValue = await this.redisClient.get(key);
    if (cachedValue) {
      return JSON.parse(cachedValue);
    }
    return cachedValue;
  }

  async hget(hashKey, key) {
    this.redisClient.hget = util.promisify(this.redisClient.hget);
    const cachedValue = await this.redisClient.hget(hashKey, key);
    if (cachedValue) {
      return JSON.parse(cachedValue);
    }
    return cachedValue;
  }

  async set(key, value, cacheExpiry = 864000) {
    this.redisClient.set(key, JSON.stringify(value), "EX", cacheExpiry);
  }

  async hset(hashKey, key, value, cacheExpiry = 864000) {
    this.redisClient.hset(
      hashKey,
      key,
      JSON.stringify(value),
      "EX",
      cacheExpiry
    );
  }

  clearHash(hashKey) {
    this.redisClient.del(JSON.stringify(hashKey));
  }
}

module.exports = RedisService;
