const bodyParser = require("body-parser");
//module for logging
//check https://github.com/expressjs/morgan for documentation
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const jwt = require("jwt-simple");

const config = require("../config");
const AccessLogService = require("../services/accessLogService");
const expressGraphQL = require("express-graphql");
const graphQLSchema = require("../schema/schema");


module.exports = function() {

  //logs all request to console
  //Standard Apache combined log output.
  const accessLogService = new AccessLogService();
  accessLogService.init();

  //handle cors
  var whitelist = ['http://localhost:3000'];
  var corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS",
    credentials: true,
    exposedHeaders:['Content-Range', 'X-Content-Range', 'authenticity_token']
  }
  // this.app.options('*', cors(corsOptions));
  this.app.use(cors(corsOptions));
  this.app.use(morgan("combined", { stream: accessLogService.rotateLog() }));

  //parse any incoming request to json, wether is file or http
  this.app.use(bodyParser.json({ type: "*/*" }));

  //parse cookie
  this.app.use(cookieParser());

  //check for csfr token validity 
  this.app.use( (req, res, next) => {
    // console.log(req.headers);
    if(!!req.cookies['jwt']) {
      const headeCSFR = req.header('authenticity_token');
      const jsonJWT = jwt.decode(req.cookies['jwt'], config.jwtSecret);
      const jwtCSFR = jsonJWT.authenticity_token;
      if(headeCSFR == jwtCSFR) {
        console.log('csfr token valid');
        
      } else {
        console.log('csfr token invalid');
        return res.status(401).send({
          error: "CSFR Invalid",
          success: false
        });
      }
    }
    next();

  });

  const schema = graphQLSchema(this);
  this.app.use(
    "/graphql",
    expressGraphQL({
      schema,
      graphiql: true
    })
  );
};
