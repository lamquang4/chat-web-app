const { connectMongo } = require("./mongodb.config");
const { connectMySQL } = require("./mysql.config");

const connectDatabases = async () => {
  await connectMongo();
  await connectMySQL();
};

module.exports = connectDatabases;
