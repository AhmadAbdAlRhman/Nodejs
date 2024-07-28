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
    StoreLogo: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    },
    StoreAge: {
      type: Sequelize.INTEGER,
      unique: false,
      allowNull: true,
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
    NumberOfFollowers: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      unique: false,
    },
    NumberOfEmpty: {
      type: Sequelize.INTEGER,
      AllowNull: true,
      unique: false,
    },
  },
  {
    tableName: "stores",
    timestamps: false, // if you don't have timestamp fields
  }
);

module.exports = Store;
