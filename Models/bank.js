const Sequelize= require("sequelize");
const sequelize = require("../config/database");

const store = require("./Store");
const Customer = require("./customer");

const Bank = sequelize.define(
  "bank",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    Cemail: {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: Customer, // name of the table being referenced
        key: "email",
      },
    },
    Semail: {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: store, // name of the table being referenced
        // schema: "final", // name of the schema being referenced
        key: "email",
      },
    },
    balance: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    token:{
      type: Sequelize.INTEGER,
      allowNull:false,
      unique: true
    }
  },
  {
    tableName: "bank",
    timestamps: false, // if you don't have timestamp fields
  }
);
store.hasOne(
  Bank,
  { foreignKey: "Semail" },
  {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  }
);
Bank.belongsTo(store, { foreignKey: "Semail" });

Customer.hasOne(
  Bank,
  { foreignKey: "Cemail" },
  {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  }
);
Bank.belongsTo(Customer, { foreignKey: "Cemail" });


module.exports = Bank;