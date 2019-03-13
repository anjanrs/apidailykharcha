const ExpenseModel = require("../models/expenseModel");

module.exports = appMain => {
  const expenseModel = new ExpenseModel(appMain);
  return {
    getExpenses: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await expenseModel.getExpenses(args);
        return res.status(200).send({
          success: true,
          error: "",
          results: results,
          args
        });
      } catch (e) {
        return res.status(422).send({
          error: e,
          success: false
        });
      }
    },
    deleteExpenses: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await expenseModel.deleteExpenses(args);
        return res.status(200).send({
          success: true,
          error: "",
          results: results,
          args
        });
      } catch (e) {
        return res.status(422).send({
          error: e,
          success: false
        });
      }
    },
    saveExpenses: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await expenseModel.saveExpenses(args);
        return res.status(200).send({
          success: true,
          error: "",
          results: results,
          args
        });
      } catch (e) {
        return res.status(422).send({
          error: e,
          success: false
        });
      }
    }
  };
};
