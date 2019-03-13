const _ = require("lodash");
const asyncEach = require("async-each");
const Model = require("./model");

class MenuItemModel extends Model {
  constructor(appMain) {
    super(appMain);
  }

  async getMenuItems(args) {
    const { filters, sorts, pageNo, rowsPerPage } = args;

    const totalItems = await this.executeSelect({
      table: "menuitems",
      selectFields: "count(id) as count",
      filters
    });

    const data = await this.executeSelect({
      table: "menuitems as m",
      selectFields:
        "m.id, m.label, m.path,m.seq, ifnull(m.parent_id, '') as parent_id,  ifnull((Select p.label from menuitems as p where p.id = m.parent_id),'') as parent_menuitem ",
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
  async getMenuItemById(id) {
    const filters = [{ field: "id", operator: "=", value: id }];
    let result = await this.executeSelect({
      table: "menuitems as m",
      selectFields:
        "m.id, m.label, m.path,m.seq, ifnull(m.parent_id, '') as parent_id,   ifnull((Select p.label from menuitems as p where p.id = m.parent_id),'') as parent_menuitem ",
      filters
    });

    if (result.length) {
      return result[0];
    }
    return false;
  }

  async deleteMenuItem(menuItemId) {
    const result = await this.executeDelete({
      table: "menuitems",
      filters: [{ field: "id", operator: "=", value: menuItemId }]
    });
    if (result.length) {
      return true;
    }
    return false;
  }

  async deleteMenuItems(menuItemIds) {
    if (menuItemIds.length < 1) {
      return true;
    }
    console.log({
      table: "menuitems",
      filters: [{ field: "id", operator: "in", value: menuItemIds }]
    });
    const result = await this.executeDelete({
      table: "menuitems",
      filters: [{ field: "id", operator: "in", value: menuItemIds }]
    });

    if (result.length) {
      return true;
    }
    return false;
  }

  async saveMenuItems(toSaveItems) {
    if (toSaveItems && toSaveItems.length) {
      const savedItems = await Promise.all(
        toSaveItems.map(objItem => {
          return this.saveMenuItem(objItem);
        })
      );
      return savedItems;
    }
    return false;
  }

  async saveMenuItem(fieldValues) {
    if (
      fieldValues["parent_id"] === null ||
      fieldValues["parent_id"] === undefined ||
      fieldValues["parent_id"].toString() === ""
    ) {
      console.log("delete");
      delete fieldValues["parent_id"];
    } else {
      console.log("no delete");
      fieldValues["parent_id"] = fieldValues["parent_id"].toString().trim();
    }

    if (
      fieldValues["parent_id"] &&
      (fieldValues["parent_id"] == "0" || fieldValues["parent_id"] == "")
    ) {
      console.log("parent id");
      delete fieldValues["parent_id"];
    }

    let result = await this.executeSave({
      table: "menuitems",
      fieldValues
    });
    if (result) {
      let saveId = result.insertId ? result.insertId : fieldValues["id"];
      result = await this.getMenuItemById(saveId);

      return result;
    }
    return false;
  }
}

module.exports = MenuItemModel;
