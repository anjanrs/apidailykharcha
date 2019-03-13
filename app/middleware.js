const bodyParser = require("body-parser");
//module for logging
//check https://github.com/expressjs/morgan for documentation
const morgan = require("morgan");
const cors = require("cors");

const AccessLogService = require("../services/accessLogService");
const expressGraphQL = require("express-graphql");
const graphQLSchema = require("../schema/schema");

module.exports = function() {
  //logs all request to console
  //Standard Apache combined log output.
  const accessLogService = new AccessLogService();
  accessLogService.init();
  this.app.use(cors());
  this.app.use(morgan("combined", { stream: accessLogService.rotateLog() }));

  //parse any incoming request to json, wether is file or http
  this.app.use(bodyParser.json({ type: "*/*" }));

  const schema = graphQLSchema(this);
  this.app.use(
    "/graphql",
    expressGraphQL({
      schema,
      graphiql: true
    })
  );
};
