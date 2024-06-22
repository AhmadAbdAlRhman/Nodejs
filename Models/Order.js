const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define("order", {
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
  },
  quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
  Paid:{
    type : Sequelize.BOOLEAN, 
    defaultValue: false
  }
});
module.exports = Order;