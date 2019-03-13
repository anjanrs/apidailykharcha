const UnitModel = require("../models/unitModel");

module.exports = appMain => {
  const unitModel = new UnitModel(appMain);
  return {
    getUnits: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await unitModel.getUnits(args);
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
    deleteUnits: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await unitModel.deleteUnits(args);
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
    saveUnits: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await unitModel.saveUnits(args);
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
