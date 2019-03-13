const StoreModel = require("../models/storeModel");

module.exports = appMain => {
  const storeModel = new StoreModel(appMain);
  return {
    getStores: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await storeModel.getStores(args);
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
    deleteStores: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await storeModel.deleteStores(args);
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
    saveStores: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await storeModel.saveStores(args);
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
