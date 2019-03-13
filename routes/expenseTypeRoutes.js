const ExpenseTypeController = require("../controllers/expenseTypeController");

module.exports = (appMain, authMiddleware) => {
  const expenseTypeController = ExpenseTypeController(appMain);
  appMain.app.post(
    "/getExpenseTypes",
    authMiddleware.requireAuth,
    (req, res, next) => {
      expenseTypeController.getExpenseTypes(req, res, next);
    }
  );
  appMain.app.post(
    "/getMainExpenseTypes",
    authMiddleware.requireAuth,
    (req, res, next) => {
      expenseTypeController.getMainExpenseTypes(req, res, next);
    }
  );
  appMain.app.post(
    "/getSubExpenseTypes",
    authMiddleware.requireAuth,
    (req, res, next) => {
      expenseTypeController.getSubExpenseTypes(req, res, next);
    }
  );
  appMain.app.post(
    "/deleteExpenseTypes",
    authMiddleware.requireAuth,
    authMiddleware.requireAccess(appMain)(["Admin"]),
    (req, res, next) => {
      expenseTypeController.deleteExpenseTypes(req, res, next);
    }
  );
  appMain.app.post(
    "/saveExpenseTypes",
    authMiddleware.requireAuth,
    authMiddleware.requireAccess(appMain)(["Admin"]),
    (req, res, next) => {
      expenseTypeController.saveExpenseTypes(req, res, next);
    }
  );
  appMain.app.post(
    "/getExpensesByExpenseType",
    authMiddleware.requireAuth,
    (req, res, next) => {
      expenseTypeController.getExpensesByExpenseType(req, res, next);
    }
  );
  appMain.app.post(
    "/getExpensesBySubExpenseType",
    authMiddleware.requireAuth,
    (req, res, next) => {
      expenseTypeController.getExpensesBySubExpenseType(req, res, next);
    }
  );
};
