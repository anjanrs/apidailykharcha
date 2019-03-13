const _ = require("lodash");

class Model {
  constructor(appMain) {
    this.db = appMain.getDB();
  }

  async executeSelectWithCache({
    table,
    selectFields = "*",
    filters = [],
    sorts = [],
    pageNo = 1,
    rowsPerPage = 25,
    groupBy = ""
  }) {
    const result = await this.executeSelect(
      {
        table,
        selectFields,
        filters,
        sorts,
        pageNo,
        rowsPerPage,
        groupBy
      },
      true
    );
    return result;
  }

  async executeSelect(
    {
      table,
      selectFields = "*",
      filters = [],
      sorts = [],
      pageNo = 1,
      rowsPerPage = 25,
      groupBy = ""
    },
    cache = false
  ) {
    const sqlWhere = this.getWhereClause(filters);
    const sqlOrderBy = this.getOrderByClause(sorts);
    const sqlLimit = this.getLimitClause(pageNo, rowsPerPage);

    const sql =
      "SELECT " +
      selectFields +
      " " +
      " FROM " +
      table +
      " " +
      sqlWhere +
      groupBy +
      sqlOrderBy +
      sqlLimit;
    // const data = await this.db.executeQuery(sql, []);
    // console.log(sql);
    let result = null;
    if (cache) {
      result = await this.db.executeQueryWithCache(sql, []);
    } else {
      result = await this.db.executeQuery(sql, []);
    }
    return result;
  }

  async executeDelete({ table, filters = [] }) {
    const sqlWhere = this.getWhereClause(filters);
    const sql = "DELETE FROM " + table + sqlWhere;
    // console.log(sql);
    let result = await this.db.executeQuery(sql, []);
    return result;
  }

  async executeInsert({ table, fieldValues }) {
    let sql = "INSERT INTO " + table + " SET ";
    sql += this.setValues(fieldValues);
    // console.log(sql);
    let result = await this.db.executeQuery(sql);
    return result;
  }

  async executeUpdate({ table, filters = [], fieldValues }) {
    let result = null;
    if (filters && filters.length > 0) {
      let sql = "UPDATE " + table + " SET ";
      sql += this.setValues(fieldValues);
      sql += this.getWhereClause(filters);
      // console.log(sql);
      result = await this.db.executeQuery(sql);
    }
    return result;
  }

  setValues(fieldValues) {
    let setValues = [];
    for (let field in fieldValues) {
      // check also if property is not inherited from prototype
      if (fieldValues.hasOwnProperty(field)) {
        if (field != "id") {
          //protect sql injection
          let value = fieldValues[field].toString().replace("'", "''");
          setValues.push("`" + field + "`" + "='" + value + "'");
        }
      }
    }
    return setValues.join(",");
  }

  async executeSave({ table, fieldValues }) {
    if (
      fieldValues["id"] &&
      (fieldValues["id"] == "0" ||
        fieldValues["id"].toString().indexOf("new") > -1)
    ) {
      let result = await this.executeInsert({
        table,
        fieldValues
      });
      return result;
    } else {
      let result = await this.executeUpdate({
        table,
        fieldValues,
        filters: [{ field: "id", operator: "=", value: fieldValues["id"] }]
      });
      return result;
    }
    return false;
  }

  //@input
  //expects filters array in the form
  // filters = [
  //   { "fields": "fieldname1", "operator": "=", "value": "value1"}
  // ]
  getWhereClause(filters) {
    let sqlWhere = "";
    if (filters && filters.length > 0) {
      let arrWhere = _.map(filters, objFilter => {
        let append = "'",
          prepend = "'",
          value = "";

        //objFilter.value will be string if its like operator
        if (
          objFilter.operator == "=" ||
          objFilter.operator == ">=" ||
          objFilter.operator == "<=" ||
          objFilter.operator == ">" ||
          objFilter.operator == "<"
        ) {
          if (objFilter.value.toString().trim() == "") {
            return "";
          }

          //sql injection protection, replace single quote with double quote
          value = objFilter.value.toString().replace("'", "''");
        }

        //objFilter.value will be string if its like operator
        if (objFilter.operator == "like") {
          if (objFilter.value.trim() == "") {
            return "";
          }
          append = " '%";
          prepend = "%' ";
          //sql injection protection, replace single quote with double quote
          value = objFilter.value.replace("'", "''");
        }

        //objFilter.value will be array if its in operator
        if (objFilter.operator == "in") {
          if (objFilter.value.length == 0) {
            return "";
          }
          append = " ( ";
          prepend = " ) ";

          //sql injection protection, replace single quote with double quote
          objFilter.value.map(val => val.toString().replace("'", "''"));
          value = "'" + objFilter.value.join("','") + "'";
        }

        return (
          objFilter.field + " " + objFilter.operator + append + value + prepend
        );
      });

      //remove empty emlements from array
      arrWhere = _.remove(arrWhere, item => {
        return item;
      });
      arrWhere.push(" 1=1 ");
      sqlWhere = " WHERE " + arrWhere.join(" AND ") + " ";
    }

    return sqlWhere;
  }

  //expects sorts array in the form
  // sorts = [
  //   { "field": "fieldname" , "orderby": "DESC"}
  //   { "field": "fieldname" , "orderby": "A"}
  // ]
  getOrderByClause(sorts) {
    let sqlOrderBy = "";
    if (sorts && sorts.length > 0) {
      const arrOrderBy = _.map(sorts, objSort => {
        return objSort.field + " " + objSort.orderBy;
      });
      sqlOrderBy = " ORDER BY " + arrOrderBy.join(", ") + " ";
    }
    return sqlOrderBy;
  }

  getLimitClause(pageNo = 1, rowsPerPage = 20) {
    const limitPage = rowsPerPage * (pageNo - 1);
    const sqlLimit = " LIMIT " + limitPage + ", " + rowsPerPage + " ";
    return sqlLimit;
  }
}

module.exports = Model;
