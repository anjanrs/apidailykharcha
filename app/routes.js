const authRouter = require("../routes/authRoutes");
const expenseRouter = require("../routes/expenseRoutes");
const expenseTypesRouter = require("../routes/expenseTypeRoutes");
const unitsRouter = require("../routes/unitRoutes");
const storeRouter = require("../routes/storeRoutes");
const userRouter = require("../routes/userRoutes");
const menuItemRouter = require("../routes/menuItemRoutes");
const userGroupRouter = require("../routes/userGroupRoutes");
const accessTypeRouter = require("../routes/accessTypeRoutes");
const authMiddleware = require("../middlewares/authMiddleware");

module.exports = function() {
  //setup routes for authentication
  authRouter(this, authMiddleware);
  expenseRouter(this, authMiddleware);
  expenseTypesRouter(this, authMiddleware);
  unitsRouter(this, authMiddleware);
  storeRouter(this, authMiddleware);
  userRouter(this, authMiddleware);
  menuItemRouter(this, authMiddleware);
  userGroupRouter(this, authMiddleware);
  accessTypeRouter(this, authMiddleware);
};
