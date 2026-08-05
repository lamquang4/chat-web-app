const { Sequelize } = require("sequelize");
const config = require("../app.config");

const sequelize = new Sequelize(
  config.mysql.database,
  config.mysql.user,
  config.mysql.password,
  {
    host: config.mysql.host,
    port: config.mysql.port,
    dialect: "mysql",
    pool: {
      max: config.mysql.connectionLimit,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  },
);

const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected");
  } catch (error) {
    console.error("MySQL connection error:", error.message);
    throw error;
  }
};

module.exports = { sequelize, connectMySQL };
