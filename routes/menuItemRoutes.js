const MenuItemController = require("../controllers/menuItemController");

module.exports = (appMain, authMiddleware) => {
  const menuItemController = MenuItemController(appMain);
  appMain.app.post(
    "/getMenuItems",
    authMiddleware.requireAuth,
    (req, res, next) => {
      menuItemController.getMenuItems(req, res, next);
    }
  );
  appMain.app.post(
    "/deleteMenuItems",
    authMiddleware.requireAuth,
    authMiddleware.requireAccess(appMain)(["Admin"]),
    (req, res, next) => {
      menuItemController.deleteMenuItems(req, res, next);
    }
  );
  appMain.app.post(
    "/saveMenuItems",
    authMiddleware.requireAuth,
    authMiddleware.requireAccess(appMain)(["Admin"]),
    (req, res, next) => {
      menuItemController.saveMenuItems(req, res, next);
    }
  );
};
