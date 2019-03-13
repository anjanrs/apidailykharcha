const UserModel = require("../models/userModel");

module.exports = appMain => {
  const userModel = new UserModel(appMain);
  return {
    getUsers: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await userModel.getUsers(args);
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
    deleteUsers: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await userModel.deleteUsers(args);
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
    saveUsers: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await userModel.saveUsers(args);
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
    saveUserAccess: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await userModel.saveUserAccess(args);
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
    getUserAccess: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await userModel.getUserAccess(args);
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
    getUserPermissions: async (req, res, next) => {
      try {
        const args = req.user;
        const results = await userModel.getUserPermissions(args);
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
    getUserMenuitems: async (req, res, next) => {
      try {
        const args = req.user;
        const results = await userModel.getUserMenuitems(args);
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
