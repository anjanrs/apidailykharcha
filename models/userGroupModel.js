const _ = require("lodash");
const asyncEach = require("async-each");
const Model = require("./model");

class UserGroupModel extends Model {
  constructor(appMain) {
    super(appMain);
  }

  async getUserGroups(args) {
    const { filters, sorts, pageNo, rowsPerPage } = args;

    const totalItems = await this.executeSelect({
      table: "usergroups",
      selectFields: "count(id) as count",
      filters
    });

    const data = await this.executeSelect({
      table: "usergroups",
      selectFields: "*",
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

  //get user by email
  async getUserGroupById(id) {
    const filters = [{ field: "id", operator: "=", value: id }];
    let result = await this.executeSelect({
      table: "usergroups",
      selectFields: "*",
      filters
    });

    if (result.length) {
      return result[0];
    }
    return false;
  }

  async deleteUserGroup(userGroupId) {
    const result = await this.executeDelete({
      table: "usergroups",
      filters: [{ field: "id", operator: "=", value: userGroupId }]
    });
    if (result.length) {
      return true;
    }
    return false;
  }

  async deleteUserGroups(userGroupIds) {
    console.log(userGroupIds);
    if (userGroupIds.length < 1) {
      return true;
    }
    const result = await this.executeDelete({
      table: "usergroups",
      filters: [{ field: "id", operator: "in", value: userGroupIds }]
    });

    if (result.length) {
      return true;
    }
    return false;
  }

  async saveUserGroups(toSaveItems) {
    if (toSaveItems && toSaveItems.length) {
      const savedItems = await Promise.all(
        toSaveItems.map(objItem => {
          return this.saveUserGroup(objItem);
        })
      );
      return savedItems;
    }
    return false;
  }

  async saveUserGroup(fieldValues) {
    let result = await this.executeSave({
      table: "usergroups",
      fieldValues
    });
    if (result) {
      let saveId = result.insertId ? result.insertId : fieldValues["id"];
      result = await this.getUserGroupById(saveId);
      return result;
    }
    return false;
  }

  async getUserGroupAccess(args) {
    const { filters, sorts, pageNo, rowsPerPage } = args;

    const data = await this.executeSelect({
      table: `usergroups ug`,
      selectFields: `id,
        ifnull((select group_concat(mpu.menu_id) from menuitems_per_usergroup mpu where mpu.usergroup_id = ug.id),'') as menu_access,
        ifnull((select group_concat(apu.access_type_id) from access_per_usergroup apu where apu.usergroup_id = ug.id),'') as usergroup_access
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

  async getUserGroupAccessById(id) {
    const result = await this.executeSelect({
      table: `usergroups ug`,
      selectFields: `id,
        ifnull((select group_concat(mpu.menu_id) from menuitems_per_usergroup mpu where mpu.usergroup_id = ug.id),'') as menu_access,
        ifnull((select group_concat(apu.access_type_id) from access_per_usergroup apu where apu.usergroup_id = ug.id),'') as usergroup_access
      `,
      filters: [{ field: "id", operator: "=", value: id }]
    });

    if (result.length) {
      return result[0];
    }
    return false;
  }
  async saveUserGroupAccess(toSaveItems) {
    if (toSaveItems && toSaveItems.length) {
      let updatedIds = [];
      const savedItems = await Promise.all(
        toSaveItems.map(objItem => {
          return this.saveGroupAccess(objItem);
        })
      );
      return savedItems;
    }
    return false;
  }

  async saveGroupAccess(fieldValues) {
    let userGroupId = fieldValues["id"].toString();
    const deleteMenuAccess =
      "DELETE FROM menuitems_per_usergroup where usergroup_id=" +
      userGroupId +
      ";";
    console.log(deleteMenuAccess);
    await this.db.executeQuery(deleteMenuAccess, []);
    const deleteUserGroupAccess =
      "DELETE FROM access_per_usergroup where usergroup_id=" +
      userGroupId +
      ";";
    console.log(deleteUserGroupAccess);
    await this.db.executeQuery(deleteUserGroupAccess, []);

    let insertMenuAccess = "";
    let menuIds = fieldValues["menu_access"].toString();
    menuIds = _.split(menuIds, ",");

    for (let menuId of menuIds) {
      if (menuId !== "") {
        insertMenuAccess =
          "INSERT INTO menuitems_per_usergroup SET usergroup_id=" +
          userGroupId +
          ", menu_id=" +
          menuId +
          ";";
        console.log(insertMenuAccess);
        await this.db.executeQuery(insertMenuAccess, []);
      }
    }

    let insertUserGroupAccess = "";
    let accessTypeIds = fieldValues["usergroup_access"].toString();
    accessTypeIds = _.split(accessTypeIds, ",");
    for (let accessTypeId of accessTypeIds) {
      if (accessTypeId !== "") {
        insertUserGroupAccess =
          "INSERT INTO access_per_usergroup SET usergroup_id=" +
          fieldValues["id"] +
          ", access_type_id=" +
          accessTypeId +
          ";";
        console.log(insertUserGroupAccess);
        await this.db.executeQuery(insertUserGroupAccess, []);
      }
    }

    let result = await this.getUserGroupAccessById(userGroupId);
    return result;
  }
}

module.exports = UserGroupModel;
