const passportService = require("../services/passportService");

module.exports = function() {
  //setup routes for authentication
  passportService.setupLocalLogin(this);
  passportService.setupJwtLogin(this);
};
