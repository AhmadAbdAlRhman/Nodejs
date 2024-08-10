const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./product");
const Store = require("./Store");
const Order = require("./Order");

const Notifications = sequelize.define("note", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  StoreId: {
    type: Sequelize.INTEGER,
    references: {
      model: Store,
    },
    allowedNull: true,
  },
  OrderId: {
    type: Sequelize.INTEGER,
    references: {
      model: Order,
    },
    allowedNull: true,
  },
  customer_first:{
    type:Sequelize.STRING,
    allowedNull : true,
    unique: false
  },
  customer_second:{
    type:Sequelize.STRING,
    allowedNull : true,
    unique: false
  },
  product:{
    type:Sequelize.STRING,
    allowedNull : true,
    unique: false
  },
  address:{
    type:Sequelize.STRING,
    allowedNull : true,
    unique: false
  },
  phone:{
    type:Sequelize.STRING,
    allowedNull : true,
    unique: false
  },
  ProductId: {
    type: Sequelize.INTEGER,
    references: {
      model: Product,
    },
    allowedNull: true,
  },
  count: {
    type: Sequelize.INTEGER,
    allowedNull: true,
  },
});
module.exports = Notifications;
