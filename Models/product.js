const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  count: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  photo_data: {
    type: Sequelize.BLOB('long'),
    allowNull: true,
  },
  StoreId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  size: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  color: {
    type: Sequelize.STRING,
    allowNull: true
  },
  kind: {
    type: Sequelize.STRING,
    allowNull: true
  },
  QReader: {
    type: Sequelize.STRING,
    allowNull: true
  },
  AvgOfRating: {
    type: Sequelize.DOUBLE,
    defaultValue: 0,
  },
  //Number of Rating people
  NumberOfRating: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  disCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  Reviews: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: false,
  }
});
module.exports = Product;