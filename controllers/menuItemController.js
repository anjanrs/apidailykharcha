const MenuItemModel = require("../models/menuItemModel");

module.exports = appMain => {
  const menuItemModel = new MenuItemModel(appMain);
  return {
    getMenuItems: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await menuItemModel.getMenuItems(args);
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
    deleteMenuItems: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await menuItemModel.deleteMenuItems(args);
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
    saveMenuItems: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await menuItemModel.saveMenuItems(args);
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
