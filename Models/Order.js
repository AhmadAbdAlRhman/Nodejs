const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const product = require("./product");
const customer = require("./customer");
const Order = sequelize.define(
  "order",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    customerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false,
      references: {
        model: customer, // name of the table being referenced
        // schema: "final", // name of the schema being referenced
        key: "id",
      },
    },
    purchase: {
      type: Sequelize.BIGINT,
      allowNull: true,
      defaultValue: 0,
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
      unique: true,
    },
    productId: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: false,
      references: {
        model: product, // name of the table being referenced
        // schema: "final", // name of the schema being referenced
        key: "id",
      },
    },
    quantity: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    Paid: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "orders",
    timestamps: false, // if you don't have timestamp fields
  }
);
customer.hasMany(
  Order,
  { as: "customer", foreignKey: "customerId" },
  {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  }
); //one to many relationship from cart to user
Order.belongsTo(customer);
product.hasMany(
  Order,
  { as: "product", foreignKey: "productId" },
  {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  }
); //one to many relationship from cart to user
Order.belongsTo(product);
module.exports = Order;