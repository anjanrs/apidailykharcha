const ExpenseController = require("../controllers/expenseController");
// const RouteUtils = require("../utils/routeUtils");

module.exports = (appMain, authMiddleware) => {
  const expenseController = ExpenseController(appMain);

  appMain.app.post(
    "/getExpenses",
    authMiddleware.requireAuth,
    authMiddleware.requireAccess(appMain)(["Admin", "Data Entry"]),
    (req, res, next) => {
      expenseController.getExpenses(req, res, next);
    }
  );

  appMain.app.post(
    "/deleteExpenses",
    authMiddleware.requireAuth,
    authMiddleware.requireAccess(appMain)(["Admin", "Data Entry"]),
    (req, res, next) => {
      expenseController.deleteExpenses(req, res, next);
    }
  );
  appMain.app.post(
    "/saveExpenses",
    authMiddleware.requireAuth,
    authMiddleware.requireAccess(appMain)(["Admin", "Data Entry"]),
    (req, res, next) => {
      expenseController.saveExpenses(req, res, next);
    }
  );
};
