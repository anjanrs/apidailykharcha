const RedisService = require("../services/redisService");
module.exports = function() {
  if (this.cache) return this.cache;
  else {
    this.cache = new RedisService();
    return this.cache;
  }
};
