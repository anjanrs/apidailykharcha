const _ = require("lodash");
const asyncEach = require("async-each");
const Model = require("./model");

class ExpenseTypeModel extends Model {
  constructor(appMain) {
    super(appMain);
  }

  async getExpensesBySubExpenseType(args) {
    const { filters, sorts, pageNo, rowsPerPage } = args;
    let refinedFilter = [];
    for (let filter of filters) {
      switch (filter.field) {
        case "sub_expense_type_id":
          if (filter.value.toString().trim() != "") {
            refinedFilter.push(filter);
          }
          break;
        case "expense_date_from":
        case "expense_date_to":
          if (filter.value.toString().trim() != "") {
            refinedFilter.push({ ...filter, field: "expense_date" });
          }
          break;
        default:
          refinedFilter.push(filter);
          break;
      }
    }
    const mainExpenseTypeFilter = {
      field: " ifnull(parent_id,0)",
      operator: ">",
      value: "0"
    };

    const totalItems = await this.executeSelect({
      table: `expense_types `,
      selectFields: "count(id) as count",
      filters: [mainExpenseTypeFilter]
    });

    refinedFilter.push(mainExpenseTypeFilter);

    const data = await this.executeSelect({
      selectFields: ` et.id, et.name sub_expense_type, ifnull(sum(e.amount),0) total_spend`,
      table: `expense_types et left join expenses e on et.id = e.sub_expense_type_id`,
      groupBy: "group by et.id",
      filters: refinedFilter,
      sorts,
      pageNo,
      rowsPerPage
    });

    return {
      count: totalItems[0].count,
      data
    };
  }

  async getExpensesByExpenseType(args) {
    const { filters, sorts, pageNo, rowsPerPage } = args;
    let refinedFilter = [];
    for (let filter of filters) {
      switch (filter.field) {
        case "expense_type_id":
          if (filter.value.toString().trim() != "") {
            refinedFilter.push(filter);
          }
          break;
        case "expense_date_from":
        case "expense_date_to":
          if (filter.value.toString().trim() != "") {
            refinedFilter.push({ ...filter, field: "expense_date" });
          }
          break;
        default:
          refinedFilter.push(filter);
          break;
      }
    }
    const mainExpenseTypeFilter = {
      field: " ifnull(parent_id,0)",
      operator: "=",
      value: "0"
    };

    const totalItems = await this.executeSelect({
      table: `expense_types `,
      selectFields: "count(id) as count",
      filters: [mainExpenseTypeFilter]
    });

    refinedFilter.push(mainExpenseTypeFilter);

    const data = await this.executeSelect({
      selectFields: ` et.id, et.name expense_type, ifnull(sum(e.amount),0) total_spend`,
      table: `expense_types et left join expenses e on et.id = e.expense_type_id`,
      groupBy: "group by et.id",
      filters: refinedFilter,
      sorts,
      pageNo,
      rowsPerPage
    });

    return {
      count: totalItems[0].count,
      data
    };
  }

  async getMainExpenseTypes(args) {
    const sql = "select * from expense_types where ifnull(parent_id,0) =0";
    let result = await this.db.executeQuery(sql, []);
    return result;
  }

  async getSubExpenseTypes(args) {
    const sql = "select * from expense_types where ifnull(parent_id,0) > 0";
    let result = await this.db.executeQuery(sql, []);
    return result;
  }

  async getExpenseTypes(args) {
    const { filters, sorts, pageNo, rowsPerPage } = args;

    const totalItems = await this.executeSelect({
      table: "expense_types",
      selectFields: "count(id) as count",
      filters
    });

    const data = await this.executeSelect({
      table: "expense_types as e",
      selectFields:
        "e.*, (Select p.name from expense_types as p where p.id = e.parent_id) as parent_name",
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
  async getExpenseTypeById(id) {
    const filters = [{ field: "id", operator: "=", value: id }];
    let result = await this.executeSelect({
      table: "expense_types as e",
      selectFields:
        "e.*, (Select p.name from expense_types as p where p.id = e.parent_id) as parent_name",
      filters
    });

    if (result.length) {
      return result[0];
    }
    return false;
  }

  async deleteExpenseType(expenseTypeId) {
    const result = await this.executeDelete({
      table: "expense_types",
      filters: [{ field: "id", operator: "=", value: expenseTypeId }]
    });
    if (result.length) {
      return true;
    }
    return false;
  }

  async deleteExpenseTypes(expenseTypeIds) {
    if (expenseTypeIds.length < 1) {
      return true;
    }
    const result = await this.executeDelete({
      table: "expense_types",
      filters: [{ field: "id", operator: "in", value: expenseTypeIds }]
    });

    if (result.length) {
      return true;
    }
    return false;
  }

  async saveExpenseTypes(toSaveItems) {
    if (toSaveItems && toSaveItems.length) {
      const savedItems = await Promise.all(
        toSaveItems.map(objItem => {
          return this.saveExpenseType(objItem);
        })
      );
      return savedItems;
    }
    return false;
  }

  async saveExpenseType(fieldValues) {
    if (fieldValues["parent_id"])
      fieldValues["parent_id"] = fieldValues["parent_id"].toString();

    let result = await this.executeSave({
      table: "expense_types",
      fieldValues
    });
    if (result) {
      let saveId = result.insertId ? result.insertId : fieldValues["id"];
      result = await this.getExpenseTypeById(saveId);

      return result;
    }
    return false;
  }
}

module.exports = ExpenseTypeModel;
