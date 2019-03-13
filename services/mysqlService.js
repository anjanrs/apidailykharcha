const mysql = require("mysql");
const config = require("../config");
const RedisService = require("./redisService");
// const { promisify } = require("util");

class mysqlService {
  constructor() {
    this.connPool = this.getConnectionPool();
    this.redis = new RedisService();
    this.sqlQuery = "";
    this.sqlParams = [];
    this.cacheHashKey = "";
    this.cacheExpiry = 0;
    this.cacheQuery = false;
  }

  getConnectionPool() {
    return mysql.createPool({
      connectionLimit: config.mysqlConnectionPoolLimit,
      host: config.mysqlHost,
      user: config.mysqlUser,
      password: config.mysqlPassword,
      database: config.mysqlDatabase
    });
  }

  query(sqlQuery) {
    this.sqlQuery = sqlQuery;
    return this; // return this to make the function chainable like objDB.query(sql).parmas(id).cache().execute();
  }

  params(sqlParams) {
    this.sqlParams = sqlParams;
    return this;
  }

  cache(options) {
    this.cacheExpiry = options.cacheExpiry || 864000;
    this.cacheHashKey = options.key || "";
    this.cacheQuery = true;
    return this;
  }

  execute() {
    if (this.cacheQuery) {
      //just to make sure that chaches the query and unset cachequery so that other executes doesnot
      //cache the query
      this.cacheQuery = false;
      return this.executeQueryWithCache(
        this.sqlQuery,
        this.sqlParams,
        this.cacheHashKey,
        this.cacheExpiry
      );
    } else {
      return this.executeQuery(this.sqlQuery, this.sqlParams);
    }
  }

  //execute query
  executeQuery(sql, params = []) {
    return new Promise(async (resolve, reject) => {
      this.connPool.getConnection((err, conn) => {
        if (err) {
          reject(err);
        } else {
          params =
            params.length > 0
              ? params.map(param => (param ? param.toString().trim() : param))
              : [];

          conn.query(sql, params, (err, result, fields) => {
            conn.release();
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
      });
    });
  }

  //executes query and stores result in cache
  executeQueryWithCache(sql, params = [], hashKey = "", cacheExpiry = 864000) {
    const cacheKey = JSON.stringify(
      Object.assign({}, { query: sql, params: params })
    );
    hashKey = JSON.stringify(hashKey);
    return new Promise(async (resolve, reject) => {
      try {
        const cachedResult = await this.redis.hget(hashKey, cacheKey);
        if (cachedResult) {
          // console.log("from cache");
          resolve(cachedResult);
        } else {
          const result = await this.executeQuery(sql, params);
          this.redis.hset(hashKey, cacheKey, result, cacheExpiry);
          // console.log("from db");
          resolve(result);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  //not used can be removed
  executeQuery1(sql, params = [], cacheQuery = false, cacheExpiry = 864000) {
    const cacheKey = JSON.stringify(
      Object.assign({}, { query: sql, params: params })
    );
    return new Promise(async (resolve, reject) => {
      let blnExecuteQuery = !cacheQuery;
      if (cacheQuery) {
        const cachedResult = await this.cache.get(cacheKey);
        if (cachedResult) {
          resolve(cachedResult);
        } else {
          blnExecuteQuery = true;
        }
      }

      if (blnExecuteQuery) {
        this.connPool.getConnection((err, conn) => {
          if (err) {
            reject(err);
          } else {
            params =
              params.length > 0
                ? params.map(param => (param ? param.toString().trim() : param))
                : [];

            conn.query(sql, params, (err, result, fields) => {
              conn.release();
              if (err) {
                reject(err);
              } else {
                if (cacheQuery) {
                  this.cache.set(cacheKey, result);
                }
                resolve(result);
              }
            });
          }
        });
      }
    });
  }
  // executeQuery(sql) {
  //   return promisify(this.conn.query);
  // }
}

module.exports = mysqlService;
