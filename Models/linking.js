/*import the table*/
const sequelize = require('../config/database');
require("./product");
require("./customer");
require("./Store");
require("./Order");
require("./Product_image");
require("./bank");
/*_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_*/
(async () => {
  try {
    // await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Sync all models
    // await sequelize.sync({ force: true }); // force: true will drop the table if it already exists
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();