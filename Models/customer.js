const Sequelize= require("sequelize");
const sequelize = require("../config/database");
const Customer = sequelize.define("customer", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  second_name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  telephone: {
    type: Sequelize.INTEGER,
    allowNull:true,
    unique: true,
  },
  address: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
  },
  photo: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  resToken: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true,
  },
  resetTokenExpiration:{
    type: Sequelize.DATE,
    allowNull: true,
  }
});

module.exports = Customer;
