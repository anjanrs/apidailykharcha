const passport = require("passport");
const UserModel = require("../models/userModel");
const _ = require("lodash");
exports.requireSignin = passport.authenticate("local", {
  session: false
});

exports.requireAuth = passport.authenticate("jwt", {
  session: false
});

exports.requireAccess = appMain => usergroups => async (req, res, next) => {
  let hasAccess = false;
  if (appMain && usergroups && _.isArray(usergroups) && usergroups.length > 0) {
    const accessUserGroups = _.map(usergroups, group =>
      group
        .toString()
        .toLowerCase()
        .trim()
    );
    const objUser = req.user;
    const userModel = new UserModel(appMain);
    const userGroups = await userModel.getUserGroupByUserId(objUser.id);
    for (let objUserGroup of userGroups) {
      let userUserGroup = objUserGroup["name"]
        .toString()
        .toLowerCase()
        .trim();
      if (_.indexOf(accessUserGroups, userUserGroup) > -1) {
        hasAccess = true;
        break;
      }
    }
  }
  if (hasAccess) {
    next();
  } else {
    return res.status(401).send({
      error: "Access Denied",
      success: false
    });
  }

  //get the user group
  //compare usergroups param with the user group from db
  //if there is any match return true
  //else return access denied
};
