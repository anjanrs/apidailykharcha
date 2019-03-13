const ExpenseTypeModel = require("../models/expenseTypeModel");

module.exports = appMain => {
  const expenseTypeModel = new ExpenseTypeModel(appMain);

  return {
    getExpenseTypes: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await expenseTypeModel.getExpenseTypes(args);
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
    getSubExpenseTypes: async (req, res, next) => {
      try {
        let args = req.body;
        const results = await expenseTypeModel.getSubExpenseTypes(args);
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
    getMainExpenseTypes: async (req, res, next) => {
      try {
        let args = req.body;
        const results = await expenseTypeModel.getMainExpenseTypes(args);
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
    deleteExpenseTypes: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await expenseTypeModel.deleteExpenseTypes(args);
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
    saveExpenseTypes: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await expenseTypeModel.saveExpenseTypes(args);
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
    getExpensesByExpenseType: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await expenseTypeModel.getExpensesByExpenseType(args);
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
    getExpensesBySubExpenseType: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await expenseTypeModel.getExpensesBySubExpenseType(
          args
        );
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
