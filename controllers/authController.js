const UserModel = require("../models/userModel");
const uuidv1 = require("uuid/v1");

module.exports = appMain => {
  const userModel = new UserModel(appMain);
  return {
    signin: async (req, res, next) => {
      // User has already had their email and passowrd auth'
      // We just need to give them a token
      // user object is attached to req from passwport
      const authenticity_token = uuidv1();
      req.user.authenticity_token = authenticity_token;
      const token = await userModel.createJWTToken(req.user);

      // Send Set-Cookie header
      // res.cookie('jwt', token, { httpOnly: true, sameSite: true, signed: true, secure: true });
      res.cookie('jwt', token, { httpOnly: true, secure: false });
      
      //set authenticity_token for CSRF protection
      res.header('authenticity_token', authenticity_token);
      return res.send({ success: true });
    },
    signout: async (req, res, next) => {
      // res.cookie('jwt', token, { httpOnly: true, sameSite: true, signed: true, secure: true });
      res.cookie('jwt', '', { maxAge: 0, expire: Date.now(), httpOnly: true, secure: false  });
      return res.send({ success: true, });
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
          const authenticity_token = uuidv1();
          result.authenticity_token = authenticity_token;
          const token = await userModel.createJWTToken(result);
          // res.cookie('jwt', token, { httpOnly: true, sameSite: true, signed: true, secure: true });
          res.cookie('jwt', token, {httpOnly: true });

          //set authenticity_token for CSRF protection
          res.header('authenticity_token', authenticity_token);
          return res.send({ success: true });
        }
      } catch (error) {
        return res
          .status(422)
          .send({ success: false, errorMsg: "Request cannot be processed" });
      }
    }
  };
};
