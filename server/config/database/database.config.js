const { connectMongo } = require("./mongodb.config");
const { connectMySQL } = require("./mysql.config");
const { connectRedis } = require("./redis.config");

const connectDatabases = async () => {
  await connectMongo();
  await connectMySQL();

  try {
    await connectRedis();
  } catch (error) {
    console.warn(error);
  }
};

module.exports = connectDatabases;
