/*create the connection to the database */
const Sequelize = require("sequelize");
const sequelize = new Sequelize("final", "testUser1", "Ahmad45@2000", {
  dialect: "mysql",
  host: "localhost",
});
module.exports = sequelize;