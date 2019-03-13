const AccessTypeController = require("../controllers/accessTypeController");

module.exports = (appMain, authMiddleware) => {
  const accessTypeController = AccessTypeController(appMain);
  appMain.app.post("/getAccessTypes", (req, res, next) => {
    accessTypeController.getAccessTypes(req, res, next);
  });
};
