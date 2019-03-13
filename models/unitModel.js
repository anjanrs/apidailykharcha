const _ = require("lodash");
const asyncEach = require("async-each");
const Model = require("./model");

class UnitModel extends Model {
  constructor(appMain) {
    super(appMain);
  }

  async getUnits(args) {
    const { filters, sorts, pageNo, rowsPerPage } = args;

    const totalItems = await this.executeSelect({
      table: "units",
      selectFields: "count(id) as count",
      filters
    });

    const data = await this.executeSelect({
      table: "units",
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
  async getUnitById(id) {
    const filters = [{ field: "id", operator: "=", value: id }];
    let result = await this.executeSelect({
      table: "units",
      selectFields: "*",
      filters
    });

    if (result.length) {
      return result[0];
    }
    return false;
  }

  async deleteUnit(unitId) {
    const result = await this.executeDelete({
      table: "units",
      filters: [{ field: "id", operator: "=", value: unitId }]
    });
    if (result.length) {
      return true;
    }
    return false;
  }

  async deleteUnits(unitIds) {
    console.log(unitIds);
    if (unitIds.length < 1) {
      return true;
    }
    const result = await this.executeDelete({
      table: "units",
      filters: [{ field: "id", operator: "in", value: unitIds }]
    });

    if (result.length) {
      return true;
    }
    return false;
  }

  async saveUnits(toSaveItems) {
    if (toSaveItems && toSaveItems.length) {
      const savedItems = await Promise.all(
        toSaveItems.map(objItem => {
          return this.saveUnit(objItem);
        })
      );
      return savedItems;
    }
    return false;
  }

  async saveUnit(fieldValues) {
    console.log(fieldValues);
    let result = await this.executeSave({
      table: "units",
      fieldValues
    });
    if (result) {
      let saveId = result.insertId ? result.insertId : fieldValues["id"];
      result = await this.getUnitById(saveId);
      return result;
    }
    return false;
  }
}

module.exports = UnitModel;
