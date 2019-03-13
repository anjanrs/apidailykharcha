const _ = require("lodash");
const asyncEach = require("async-each");
const Model = require("./model");

class StoreModel extends Model {
  constructor(appMain) {
    super(appMain);
  }

  async getStores(args) {
    const { filters, sorts, pageNo, rowsPerPage } = args;

    const totalItems = await this.executeSelect({
      table: "stores",
      selectFields: "count(id) as count",
      filters
    });

    const data = await this.executeSelect({
      table: "stores",
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
  async getStoreById(id) {
    const filters = [{ field: "id", operator: "=", value: id }];
    let result = await this.executeSelect({
      table: "stores",
      selectFields: "*",
      filters
    });

    if (result.length) {
      return result[0];
    }
    return false;
  }

  async deleteStore(storeId) {
    const result = await this.executeDelete({
      table: "stores",
      filters: [{ field: "id", operator: "=", value: storeId }]
    });
    if (result.length) {
      return true;
    }
    return false;
  }

  async deleteStores(storeIds) {
    console.log(storeIds);
    if (storeIds.length < 1) {
      return true;
    }
    const result = await this.executeDelete({
      table: "stores",
      filters: [{ field: "id", operator: "in", value: storeIds }]
    });

    if (result.length) {
      return true;
    }
    return false;
  }

  async saveStores(toSaveItems) {
    if (toSaveItems && toSaveItems.length) {
      const savedItems = await Promise.all(
        toSaveItems.map(objItem => {
          return this.saveStore(objItem);
        })
      );
      return savedItems;
    }
    return false;
  }

  async saveStore(fieldValues) {
    console.log(fieldValues);
    let result = await this.executeSave({
      table: "stores",
      fieldValues
    });
    if (result) {
      let saveId = result.insertId ? result.insertId : fieldValues["id"];
      result = await this.getStoreById(saveId);
      return result;
    }
    return false;
  }
}

module.exports = StoreModel;
