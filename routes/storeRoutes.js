const StoreController = require("../controllers/storeController");

module.exports = (appMain, authMiddleware) => {
  const storeController = StoreController(appMain);
  appMain.app.post(
    "/getStores",
    authMiddleware.requireAuth,
    (req, res, next) => {
      storeController.getStores(req, res, next);
    }
  );
  appMain.app.post(
    "/deleteStores",
    authMiddleware.requireAuth,
    authMiddleware.requireAccess(appMain)(["Admin"]),
    (req, res, next) => {
      storeController.deleteStores(req, res, next);
    }
  );
  appMain.app.post(
    "/saveStores",
    authMiddleware.requireAuth,
    authMiddleware.requireAccess(appMain)(["Admin"]),
    (req, res, next) => {
      storeController.saveStores(req, res, next);
    }
  );
};
