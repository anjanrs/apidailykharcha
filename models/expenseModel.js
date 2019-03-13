const _ = require("lodash");
const asyncEach = require("async-each");
const Model = require("./model");

class ExpenseModel extends Model {
  constructor(appMain) {
    super(appMain);
  }

  async getExpenses(args) {
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

    const totalItems = await this.executeSelect({
      table: ` expenses e
              left join expense_types et on e.expense_type_id = et.id
              left join expense_types ets on e.sub_expense_type_id = ets.id
              left join units u on e.unit_id = u.id
              left join stores s on e.store_id = s.id`,
      selectFields: "count(e.id) as count",
      filters: refinedFilter
    });

    const data = await this.executeSelect({
      table: ` expenses e
              left join expense_types et on e.expense_type_id = et.id
              left join expense_types ets on e.sub_expense_type_id = ets.id
              left join units u on e.unit_id = u.id
              left join stores s on e.store_id = s.id`,
      selectFields: `date_format(from_unixtime(e.expense_date),"%d-%m-%Y") as expense_date_formatted,
                    ifnull(et.name,'') expense_type,
                    ifnull(ets.name,'') sub_expense_type,
                    ifnull(u.name,'') unit,
                    ifnull(s.name,'') store,
                    e.*`,
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

  //get user by email
  async getExpenseById(id) {
    const filters = [{ field: "e.id", operator: "=", value: id }];
    let result = await this.executeSelect({
      table: ` expenses e
              left join expense_types et on e.expense_type_id = et.id
              left join expense_types ets on e.sub_expense_type_id = ets.id
              left join units u on e.unit_id = u.id
              left join stores s on e.store_id = s.id`,
      selectFields: `date_format(from_unixtime(e.expense_date),"%d-%m-%Y") as expense_date_formatted,
                    ifnull(et.name,'') expense_type,
                    ifnull(ets.name,'') sub_expense_type,
                    ifnull(u.name,'') unit,
                    ifnull(s.name,'') store,
                      e.*`,
      filters
    });

    if (result.length) {
      return result[0];
    }
    return false;
  }

  async deleteExpense(expenseId) {
    const result = await this.executeDelete({
      table: "expenses",
      filters: [{ field: "id", operator: "=", value: expenseId }]
    });
    if (result.length) {
      return true;
    }
    return false;
  }

  async deleteExpenses(expenseIds) {
    if (expenseIds.length < 1) {
      return true;
    }

    // expenseIds = "'" + expenseIds.join("','") + "'";
    // const sql = "DELETE FROM expenses WHERE id  in (" + expenseIds + ")";
    // const result = await this.db.executeQuery(sql, []);

    const result = await this.executeDelete({
      table: "expenses",
      filters: [{ field: "id", operator: "in", value: expenseIds }]
    });

    if (result.length) {
      return true;
    }
    return false;
  }

  async saveExpenses(toSaveItems) {
    if (toSaveItems && toSaveItems.length) {
      let updatedIds = [];
      const savedItems = await Promise.all(
        toSaveItems.map(objItem => {
          return this.saveExpense(objItem);
        })
      );
      // _.each(savedItems, item => {
      //   updatedIds.push(item.id);
      // });
      return savedItems;
    }
    return false;
  }

  async saveExpense(fieldValues) {
    fieldValues["user_id"] = 1;
    if (
      fieldValues["sub_expense_type_id"] &&
      fieldValues["sub_expense_type_id"].toString().trim() == ""
    ) {
      fieldValues["sub_expense_type_id"] = "0";
    }
    let result = await this.executeSave({ table: "expenses", fieldValues });
    if (result) {
      let saveId = result.insertId ? result.insertId : fieldValues["id"];
      result = await this.getExpenseById(saveId);
      return result;
    }
    return false;
  }
}

module.exports = ExpenseModel;
