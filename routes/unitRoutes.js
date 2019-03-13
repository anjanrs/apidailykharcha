const UnitsController = require("../controllers/unitController");

module.exports = (appMain, authMiddleware) => {
  const unitsController = UnitsController(appMain);
  appMain.app.post(
    "/getUnits",
    authMiddleware.requireAuth,
    (req, res, next) => {
      unitsController.getUnits(req, res, next);
    }
  );
  appMain.app.post(
    "/deleteUnits",
    authMiddleware.requireAuth,
    authMiddleware.requireAccess(appMain)(["Admin"]),
    (req, res, next) => {
      unitsController.deleteUnits(req, res, next);
    }
  );
  appMain.app.post(
    "/saveUnits",
    authMiddleware.requireAuth,
    authMiddleware.requireAccess(appMain)(["Admin"]),
    (req, res, next) => {
      unitsController.saveUnits(req, res, next);
    }
  );
};
