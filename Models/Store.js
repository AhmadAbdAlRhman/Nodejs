const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Store = sequelize.define(
  "Store",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    StoreName: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    StoreLocation: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    },
    StoreKind: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    },
    SellerName: {
      type: Sequelize.STRING,
      AllowNull: true,
      unique: false,
    },
    email: {
      type: Sequelize.STRING,
      AllowNull: true,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      AllowNull: true,
      unique: true,
    },
    SellerPhone: {
      type: Sequelize.STRING(100),
      AllowNull: true,
      unique: true,
    },
  },
  {
    tableName: "stores",
    timestamps: false, // if you don't have timestamp fields
  }
);

module.exports = Store;
