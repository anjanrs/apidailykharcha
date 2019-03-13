const AccessTypeModel = require("../models/accessTypeModel");

module.exports = appMain => {
  const accessTypeModel = new AccessTypeModel(appMain);
  return {
    getAccessTypes: async (req, res, next) => {
      try {
        const args = req.body;
        const results = await accessTypeModel.getAccessTypes(args);
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
