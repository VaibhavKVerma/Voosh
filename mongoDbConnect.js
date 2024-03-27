const mongoose = require("mongoose");
const resolve = require("path").resolve;
const dotEnvPath = resolve(".env");
require("dotenv").config({ path: dotEnvPath });

const mongoDbUri = process.env.MONGO_DB_URI;

module.exports = () => {
  const connectToMongoDb = async () => {
    try {
      await mongoose.connect(mongoDbUri);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  };

  const closeMongoDbConnection = async () => {
    try {
      await mongoose.connection.close();
      console.log("Closed MongoDB connection");
    } catch (error) {
      console.error("Error closing MongoDB connection:", error);
    }
  };

  return {
    connectToMongoDb,
    closeMongoDbConnection,
  };
};