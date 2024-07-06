const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Rahaf = sequelize.define("rahaf", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  questions: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  option1: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  option2: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  option3: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  option4: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  option5: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  answer: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});
module.exports = Rahaf;