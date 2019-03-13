const AppMain = function() {
  this.options = {};
};

AppMain.prototype.getDB = require("./db");
AppMain.prototype.getCache = require("./cache");
AppMain.prototype.setupMiddlewares = require("./middleware");
AppMain.prototype.setupRoutes = require("./routes");
AppMain.prototype.setupPassport = require("./passport");
AppMain.prototype.init = require("./init");

// _.extend(AppMain.prototype);
module.exports = new AppMain();
