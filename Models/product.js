const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const Store = require("./Store");
const Product = sequelize.define(
  "product",
  {
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
      type: Sequelize.STRING,
      allowNull: true,
    },
    StoreId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Store, // name of the table being referenced
        key: "id",
      },
    },
    size: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    color: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    kind: {
      type: Sequelize.STRING,
      allowNull: true,
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
  },
  {
    tableName: "products",
    timestamps: false, // if you don't have timestamp fields
  }
);
Store.hasMany(
  Product,
  { as: "products", foreignKey: "StoreId" },
  {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  }
);
Product.belongsTo(Store, { foreignKey: "StoreId" });
module.exports = Product;