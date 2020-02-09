const UserModel = require("../models/userModel");

module.exports = appMain => {
  const userModel = new UserModel(appMain);
  return {
    signin: async (req, res, next) => {
      // User has already had their email and passowrd auth'
      // We just need to give them a token
      // user object is attached to req from passwport
      const token = await userModel.createJWTToken(req.user);
      // Send Set-Cookie header
      res.cookie('jwt', token, {
        httpOnly: true,
        // sameSite: true,
        // signed: true,
        // secure: true
        secure: false 
      });
      return res.send({
        success: true,
        token
      });
    },
    signout: async (req, res, next) => {
      res.cookie('jwt', '', {
        httpOnly: true,
        // sameSite: true,
        // signed: true,
        // secure: true
        secure: false 
      });
      return res.send({
        success: true,
      });
    },
    //signup new user if email is not already created
    //return the jwt token
    signup: async (req, res, next) => {
      const email = req.body.email;
      const password = req.body.password;
      //more validation need to be added
      if (!email || !password) {
        return res.status(422).send({
          success: false,
          errorMsg: "You must provied email and password"
        });
      }
      try {
        const result = await userModel.getUserByEmail(email);
        if (result) {
          return res.status(422).send({ error: "Email in use" });
        } else {
          const result = await userModel.createNewuser(email, password);
          const token = await userModel.createJWTToken(result);
          res.cookie('jwt', token, {
            httpOnly: true,
            // sameSite: true,
            // signed: true,
            // secure: true
          });
          return res.send({
            success: true,
            // token
          });
        }
      } catch (error) {
        return res
          .status(422)
          .send({ success: false, errorMsg: "Request cannot be processed" });
      }
    }
  };
};
