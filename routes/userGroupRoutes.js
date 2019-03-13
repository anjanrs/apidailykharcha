const UserGroupController = require("../controllers/userGroupController");

module.exports = (appMain, authMiddleware) => {
  const userGroupController = UserGroupController(appMain);
  appMain.app.post(
    "/getUserGroups",
    authMiddleware.requireAuth,
    authMiddleware.requireAccess(appMain)(["Admin"]),
    (req, res, next) => {
      userGroupController.getUserGroups(req, res, next);
    }
  );
  appMain.app.post(
    "/deleteUserGroups",
    authMiddleware.requireAuth,
    authMiddleware.requireAccess(appMain)(["Admin"]),
    (req, res, next) => {
      userGroupController.deleteUserGroups(req, res, next);
    }
  );
  appMain.app.post(
    "/saveUserGroups",
    authMiddleware.requireAuth,
    authMiddleware.requireAccess(appMain)(["Admin"]),
    (req, res, next) => {
      userGroupController.saveUserGroups(req, res, next);
    }
  );
  appMain.app.post(
    "/getUserGroupAccess",
    authMiddleware.requireAuth,
    (req, res, next) => {
      userGroupController.getUserGroupAccess(req, res, next);
    }
  );
  appMain.app.post(
    "/saveUserGroupAccess",
    authMiddleware.requireAuth,
    authMiddleware.requireAccess(appMain)(["Admin"]),
    (req, res, next) => {
      userGroupController.saveUserGroupAccess(req, res, next);
    }
  );
};
