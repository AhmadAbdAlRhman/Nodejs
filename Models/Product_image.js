const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const Product_image = sequelize.define("product_image", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});
module.exports = Product_image;
