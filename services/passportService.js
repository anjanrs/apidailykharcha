const passport = require("passport");
const LocalStrategy = require("passport-local");
const UserModel = require("../models/userModel");

const config = require("../config");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

exports.setupJwtLogin = appMain => {
  const userModel = new UserModel(appMain);

  //Setup options for JWT JwtStrategy
  var extractJwtFromCookie = req => {
    var token = null;
    if (req && req.cookies) token = req.cookies["jwt"];
    return token;
  };

  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    // jwtFromRequest: extractJwtFromCookie,
    secretOrKey: config.jwtSecret
  };

  //Create JWT strategy
  const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
    //See if the user Id in the payload exists in our database
    const user = await userModel.getUserById(payload.sub);

    //If it does, call 'done' wht that other
    if (user) {
      done(null, user);
    } else {
      //otherwise call done without a user object
      done(null, false);
    }
  });

  //Tell passport to use this strategy
  passport.use(jwtLogin);
};

exports.setupLocalLogin = function(appMain) {
  //Create local Strategy
  const userModel = new UserModel(appMain);
  const localOptions = { usernameField: "email" };
  const localLogin = new LocalStrategy(
    localOptions,
    async (email, password, done) => {
      //Verify the username and password, call done with the user
      //if it is the correct username and password
      //otherwise, call done with false
      const user = await userModel.getUserByEmail(email);
      if (!user) {
        return done(null, false);
      }

      const isMatch = await userModel.comparePassword(password, user.password);
      if (!isMatch) {
        return done(null, false);
      }
      return done(null, user);
    }
  );
  passport.use(localLogin);
};
