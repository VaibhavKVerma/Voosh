const resolve = require("path").resolve;
const dotEnvPath = resolve(".env");
require("dotenv").config({ path: dotEnvPath });

const mongoDb = require("./mongoDbConnect.js");
const app = require('./start');

const init = async () => {
  try {
    // Initialize MongoDB
    const mongoDbClient = mongoDb();
    await mongoDbClient.connectToMongoDb();

    process.on('SIGINT', async () => {
      await mongoDbClient.closeMongoDbConnection();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await mongoDbClient.closeMongoDbConnection();
      process.exit(0);
    });

    app.listen(process.env.PORT_NUMBER, () => {
      console.log("Connection Started on PORT", process.env.PORT_NUMBER);
    });
  } catch (error) {
    console.error("Initialization error:", error);
    process.exit(1);
  }
};

init();