const graphql = require("graphql");
const _ = require("lodash");
const UserModel = require("../models/userModel");
const ExpenseModel = require("../models/expenseModel");

module.exports = function(appMain) {
  const userModel = new UserModel(appMain);
  const expenseModel = new ExpenseModel(appMain);

  const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema
  } = graphql;

  const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
      id: { type: GraphQLInt },
      email: { type: GraphQLString },
      expenses: {
        type: new GraphQLList(ExpenseType),
        async resolve(parentValue, args) {
          const expenses = await expenseModel.getExpesesForUser(parentValue.id);
          return expenses;
        }
      }
    })
  });

  const ExpenseType = new GraphQLObjectType({
    name: "Expenses",
    fields: () => ({
      id: { type: GraphQLInt },
      item_name: { type: GraphQLString },
      expense_date: { type: GraphQLInt },
      expense_type_id: { type: GraphQLInt },
      sub_expense_type_id: { type: GraphQLInt },
      quantity: { type: GraphQLFloat },
      unit_price: { type: GraphQLFloat },
      amount: { type: GraphQLFloat },
      store_id: { type: GraphQLInt },
      description: { type: GraphQLString },
      user: {
        type: UserType,
        async resolve(parentValue, args) {
          const user = await userModel.getUserById(parentValue.user_id);
          return user;
        }
      }
    })
  });

  const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      user: {
        type: UserType,
        args: { id: { type: GraphQLString } },
        async resolve(parentValue, args) {
          const user = await userModel.getUserById(args.id);
          return user;
        }
      },
      expense: {
        type: ExpenseType,
        args: { id: { type: GraphQLInt } },
        async resolve(parentValue, args) {
          const expense = await expenseModel.getExpenseById(args.id);
          return expense;
        }
      },
      expenses: {
        type: new GraphQLList(ExpenseType),
        args: {
          id: { type: GraphQLInt },
          item_name: { type: GraphQLString },
          expense_date: { type: GraphQLInt },
          expense_type_id: { type: GraphQLInt },
          sub_expense_type_id: { type: GraphQLInt },
          quantity: { type: GraphQLFloat },
          unit_price: { type: GraphQLFloat },
          amount: { type: GraphQLFloat },
          store_id: { type: GraphQLInt },
          description: { type: GraphQLString }
        },
        async resolve(parentValue, args) {
          const expenses = await expenseModel.getExpenses(args);
          return expenses;
        }
      }
    }
  });
  const MutationQuery = new GraphQLObjectType({
    name: "Mutation",
    fields: {
      addUser: {
        type: UserType,
        args: {
          email: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) }
        },
        async resolve(parentValue, { email, password }) {
          const user = await userModel.createNewuser(email, password);
          return user;
        }
      },
      deleteExpense: {
        type: ExpenseType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLInt) }
        },
        async resolve(parentValue, { id }) {
          const expense = await expenseModel.deleteExpense(id);
          return expense;
        }
      },
      editExpense: {
        type: ExpenseType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLInt) },
          item_name: { type: GraphQLString },
          expense_date: { type: GraphQLInt },
          expense_type_id: { type: GraphQLInt },
          sub_expense_type_id: { type: GraphQLInt },
          quantity: { type: GraphQLFloat },
          unit_price: { type: GraphQLFloat },
          amount: { type: GraphQLFloat },
          store_id: { type: GraphQLInt },
          description: { type: GraphQLString },
          user_id: { type: GraphQLInt }
        },
        async resolve(parentValue, args) {
          const expense = await expenseModel.editExpense(args);
          return expense;
        }
      }
    }
  });

  return new GraphQLSchema({
    query: RootQuery,
    mutation: MutationQuery
  });
};
