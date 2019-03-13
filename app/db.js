const mysqlService = require("../services/mysqlService");
module.exports = function() {
  if (this.db) return this.db;
  else {
    this.db = new mysqlService();
    return this.db;
  }
};
