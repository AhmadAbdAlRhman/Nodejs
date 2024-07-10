const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const test = sequelize.define("test", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
module.exports = test;