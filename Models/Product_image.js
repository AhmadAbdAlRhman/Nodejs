const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const product = require("./product")
const Product_image = sequelize.define(
  "product_image",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false,
      references: {
        model: product, // name of the table being referenced
        key: "id",
      },
    },
    imageUrl: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "product_images",
    timestamps: false, // if you don't have timestamp fields
  }
);

product.hasMany(
  Product_image,
  { as: "image", foreignKey: "productId" },
  {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  }
); //one to many relationship from cart to user
Product_image.belongsTo(product);
module.exports = Product_image;
