const AuthController = require("../controllers/authController");

module.exports = (appMain, authMiddleware) => {
  // appMain.app.get("/", requireAuth, (req, res) => {
  const authController = AuthController(appMain);
  appMain.app.get("/", (req, res) => {
    return res.send({ hi: "there" });
  });

  appMain.app.post(
    "/signin",
    authMiddleware.requireSignin,
    (req, res, next) => {
      // const authController = AuthController(appMain);
      authController.signin(req, res, next);
    }
  );

  appMain.app.post("/signup", (req, res, next) => {
    // const authController = AuthController(appMain);
    authController.signup(req, res, next);
  });
  appMain.app.post("/signout", (req, res, next) => {
    // const authController = AuthController(appMain);
    authController.signout(req, res, next);
  });
};
