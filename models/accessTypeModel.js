const _ = require("lodash");
const asyncEach = require("async-each");
const Model = require("./model");

class UserGroupModel extends Model {
  constructor(appMain) {
    super(appMain);
  }

  async getAccessTypes(args) {
    const { filters, sorts, pageNo, rowsPerPage } = args;

    const totalItems = await this.executeSelect({
      table: "access_types",
      selectFields: "count(id) as count",
      filters
    });

    const data = await this.executeSelect({
      table: "access_types",
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
}

module.exports = UserGroupModel;
