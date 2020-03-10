const _ = require("lodash");
const jwt = require("jwt-simple");
const config = require("../config");
const bcrypt = require("bcrypt-nodejs");
const Model = require("./model");

class UserModel extends Model {
  constructor(appMain) {
    super(appMain);
  }

  //create jwt tokent
  async createJWTToken(user) {
    const timestamp = new Date().getTime();
    return jwt.encode(
      {
        sub: user.id,
        iat: timestamp,
        authenticity_token: user.authenticity_token
      },
      config.jwtSecret
    );
  }

  //encrypt the password with bcryptuser
  encryptPassword(password) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          reject(err);
        } else {
          bcrypt.hash(password, salt, null, (err, hash) => {
            if (err) {
              reject(err);
            } else {
              resolve(hash);
            }
          });
        }
      });
    });
  }

  comparePassword(candidatePassword, password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(candidatePassword, password, (err, isMatch) => {
        if (err) {
          reject(err);
        } else {
          resolve(isMatch);
        }
      });
    });
  }

  //get user by email
  async getUserById(id) {
    // const sql = "SELECT * FROM users WHERE id = ?";
    // const result = await this.db.executeQuery(sql, [id]);
    const result = await this.executeSelect({
      table: "users",
      selectFields:
        "id, username, email, '' as password, '*****' as masked_password, first_name, last_name",
      filters: [{ field: "id", operator: "=", value: id }]
    });

    if (result.length) {
      return result[0];
    }
    return false;
  }

  //get user by email
  async getUserByEmail(email) {
    // const sql = "SELECT * FROM users WHERE email = ?";
    // const result = await this.db.executeQuery(sql, [email]);

    const result = await this.executeSelect({
      table: "users",
      selectFields: "*",
      filters: [{ field: "email", operator: "=", value: email }]
    });

    if (result.length) {
      return result[0];
    }
    return false;
  }

  //creates new user
  async createNewuser(email, password) {
    const encPassword = await this.encryptPassword(password);
    // const sql = "INSERT INTO users(email, password) VALUES(?,?)";
    // let result = await this.db.executeQuery(sql, [email, encPassword]);

    const result = await this.executeInsert({
      table: "users",
      fieldValues: { email, password: encPassword }
    });

    result = await this.getUserById(result.insertId);
    return result;
  }

  async getUsers(args) {
    const { filters, sorts, pageNo, rowsPerPage } = args;

    const totalItems = await this.executeSelect({
      table: `users`,
      selectFields: "count(id) as count",
      filters
    });

    const data = await this.executeSelect({
      table: `users`,
      selectFields:
        "id, username, email, '' as password, '*****' as masked_password, first_name, last_name",
      filters,
      sorts,
      pageNo,
      rowsPerPage
    });

    return {
      count: totalItems[0].count,
      data
    };
  }

  async deleteUser(id) {
    const result = await this.executeDelete({
      table: "users",
      filters: [{ field: "id", operator: "=", value: expenseId }]
    });
    if (result.length) {
      return true;
    }
    return false;
  }

  async deleteUsers(userIds) {
    if (userIds.length < 1) {
      return true;
    }

    const result = await this.executeDelete({
      table: "users",
      filters: [{ field: "id", operator: "in", value: userIds }]
    });

    if (result.length) {
      return true;
    }
    return false;
  }

  async saveUsers(toSaveItems) {
    if (toSaveItems && toSaveItems.length) {
      let updatedIds = [];
      const savedItems = await Promise.all(
        toSaveItems.map(objItem => {
          return this.saveUser(objItem);
        })
      );
      // _.each(savedItems, item => {
      //   updatedIds.push(item.id);
      // });
      return savedItems;
    }
    return false;
  }

  async saveUser(fieldValues) {
    fieldValues["password"] = await this.encryptPassword(
      fieldValues["password"]
    );
    let result = await this.executeSave({ table: "users", fieldValues });
    if (result) {
      let saveId = result.insertId ? result.insertId : fieldValues["id"];
      result = await this.getUserById(saveId);
      return result;
    }
    return false;
  }

  async getUserAccess(args) {
    const { filters, sorts, pageNo, rowsPerPage } = args;

    // const totalItems = await this.executeSelect({
    //   table: `users u`,
    //   selectFields: "count(id) as count",
    //   filters
    // });

    const data = await this.executeSelect({
      table: `users u`,
      selectFields: `id,
        ifnull((select group_concat(mpu.menu_id) from menuitems_per_user mpu where mpu.user_id = u.id),'') as menu_access,
        ifnull((select group_concat(apu.access_type_id) from access_per_user apu where apu.user_id = u.id),'') as user_access,
        ifnull((select group_concat(upu.usergroup_id) from usergroups_per_user upu where upu.user_id = u.id),'') as usergroups 
      `,
      filters,
      sorts,
      pageNo,
      rowsPerPage
    });

    return {
      count: 0,
      data
    };
  }

  //get user by email
  async getUserAccessById(id) {
    // const sql = "SELECT * FROM users WHERE id = ?";
    // const result = await this.db.executeQuery(sql, [id]);
    const result = await this.executeSelect({
      table: `users u`,
      selectFields: `id,
        ifnull((select group_concat(mpu.menu_id) from menuitems_per_user mpu where mpu.user_id = u.id),'') as menu_access,
        ifnull((select group_concat(apu.access_type_id) from access_per_user apu where apu.user_id = u.id),'') as user_access,
        ifnull((select group_concat(upu.usergroup_id) from usergroups_per_user upu where upu.user_id = u.id),'') as usergroups 
      `,
      filters: [{ field: "id", operator: "=", value: id }]
    });

    if (result.length) {
      return result[0];
    }
    return false;
  }
  async saveUserAccess(toSaveItems) {
    if (toSaveItems && toSaveItems.length) {
      let updatedIds = [];
      const savedItems = await Promise.all(
        toSaveItems.map(objItem => {
          return this.saveAccess(objItem);
        })
      );
      // _.each(savedItems, item => {
      //   updatedIds.push(item.id);
      // });
      return savedItems;
    }
    return false;
  }

  async saveAccess(fieldValues) {
    let userId = fieldValues["id"].toString();
    const deleteMenuAccess =
      "DELETE FROM menuitems_per_user where user_id=" + userId + ";";
    await this.db.executeQuery(deleteMenuAccess, []);
    const deleteUserAccess =
      "DELETE FROM access_per_user where user_id=" + userId + ";";
    await this.db.executeQuery(deleteUserAccess, []);
    const deleteUserGroups =
      "DELETE FROM usergroups_per_user where user_id=" + userId + ";";
    await this.db.executeQuery(deleteUserGroups, []);
    let insertMenuAccess = "";
    let menuIds = fieldValues["menu_access"].toString();
    menuIds = _.split(menuIds, ",");

    for (let menuId of menuIds) {
      if (menuId !== "") {
        insertMenuAccess =
          "INSERT INTO menuitems_per_user SET user_id=" +
          userId +
          ", menu_id=" +
          menuId +
          ";";
        await this.db.executeQuery(insertMenuAccess, []);
      }
    }
    let insertUserGroups = "";
    let userGroupIds = fieldValues["usergroups"].toString();
    userGroupIds = _.split(userGroupIds, ",");
    for (let userGroupId of userGroupIds) {
      if (userGroupId !== "") {
        insertUserGroups =
          "INSERT INTO usergroups_per_user SET user_id=" +
          userId +
          ", usergroup_id=" +
          userGroupId +
          ";";
        await this.db.executeQuery(insertUserGroups, []);
      }
    }

    let insertUserAccess = "";
    let accessTypeIds = fieldValues["user_access"].toString();
    accessTypeIds = _.split(accessTypeIds, ",");
    for (let accessTypeId of accessTypeIds) {
      if (accessTypeId !== "") {
        insertUserAccess =
          "INSERT INTO access_per_user SET user_id=" +
          fieldValues["id"] +
          ", access_type_id=" +
          accessTypeId +
          ";";
        await this.db.executeQuery(insertUserAccess, []);
      }
    }

    let result = await this.getUserAccessById(userId);
    return result;
  }

  //get user by email
  async getUserGroupByUserId(userId) {
    // const sql = "SELECT * FROM users WHERE id = ?";
    // const result = await this.db.executeQuery(sql, [id]);
    const result = await this.executeSelect({
      table: `users u 
              join usergroups_per_user ugp on u.id = ugp.user_id
              join usergroups ug on ugp.usergroup_id=ug.id`,
      selectFields: `ug.*`,
      filters: [{ field: "u.id", operator: "=", value: userId }]
    });
    return result;
  }

  async getUserPermissions(user) {
    const userId = user.id;
    const sql = `select  * from (select acc.type  from users u 
                  join usergroups_per_user ugp on u.id = ugp.user_id
                  join access_per_usergroup apug on ugp.usergroup_id = apug.usergroup_id
                  join access_types acc on acc.id = apug.access_type_id 
                  where u.id=?  union 
                  select  acc.type from users u 
                  join access_per_user apu on u.id= apu.user_id
                  join access_types acc on acc.id = apu.access_type_id 
                  where u.id=?) as access`;
    const result = await this.db.executeQuery(sql, [userId, userId]);
    return result;
  }

  async getUserMenuitems(user) {
    const userId = user.id;
    const sql = `select id, label,ifnull(path,'') path, ifnull(parent_id,"0") as parentId,seq from (select m.* from menuitems m
                  join menuitems_per_user mpu on mpu.menu_id = m.id
                  join users u on u.id =mpu.user_id where u.id=?
                  union
                  select m.* from menuitems m
                  join menuitems_per_usergroup mpug on mpug.menu_id = m.id
                  join usergroups ug on ug.id = mpug.usergroup_id
                  join usergroups_per_user upu on upu.usergroup_id = ug.id
                  join users u on u.id =upu.user_id where u.id=?) as menuitems order by menuitems.seq asc;`;
    const result = await this.db.executeQuery(sql, [userId, userId]);
    return result;
  }
}

module.exports = UserModel;
