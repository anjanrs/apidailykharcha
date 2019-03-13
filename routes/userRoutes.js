const UserController = require("../controllers/userController");

module.exports = (appMain, authMiddleware) => {
  const userController = UserController(appMain);
  appMain.app.post(
    "/getUsers",
    authMiddleware.requireAuth,
    authMiddleware.requireAccess(appMain)(["Admin"]),
    (req, res, next) => {
      userController.getUsers(req, res, next);
    }
  );
  appMain.app.post(
    "/deleteUsers",
    authMiddleware.requireAuth,
    authMiddleware.requireAccess(appMain)(["Admin"]),
    (req, res, next) => {
      userController.deleteUsers(req, res, next);
    }
  );
  appMain.app.post(
    "/saveUsers",
    authMiddleware.requireAuth,
    authMiddleware.requireAccess(appMain)(["Admin"]),
    (req, res, next) => {
      userController.saveUsers(req, res, next);
    }
  );
  appMain.app.post(
    "/getUserAccess",
    authMiddleware.requireAuth,
    authMiddleware.requireAccess(appMain)(["Admin"]),
    (req, res, next) => {
      userController.getUserAccess(req, res, next);
    }
  );
  appMain.app.post(
    "/saveUserAccess",
    authMiddleware.requireAuth,
    authMiddleware.requireAccess(appMain)(["Admin"]),
    (req, res, next) => {
      userController.saveUserAccess(req, res, next);
    }
  );
  appMain.app.post(
    "/getUserPermissions",
    authMiddleware.requireAuth,
    (req, res, next) => {
      userController.getUserPermissions(req, res, next);
    }
  );
  appMain.app.post(
    "/getUserMenuitems",
    authMiddleware.requireAuth,
    (req, res, next) => {
      userController.getUserMenuitems(req, res, next);
    }
  );
};
