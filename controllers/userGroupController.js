const UserGroupModel = require("../models/userGroupModel");

module.exports = appMain => {
  const userGroupModel = new UserGroupModel(appMain);
  return {
    getUserGroups: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await userGroupModel.getUserGroups(args);
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
    deleteUserGroups: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await userGroupModel.deleteUserGroups(args);
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
    saveUserGroups: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await userGroupModel.saveUserGroups(args);
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
    saveUserGroupAccess: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await userGroupModel.saveUserGroupAccess(args);
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
    getUserGroupAccess: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await userGroupModel.getUserGroupAccess(args);
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
