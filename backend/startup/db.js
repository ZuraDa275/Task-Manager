const logger = require("../logs/logger");
require("dotenv").config();
const mongoose = require("mongoose");

module.exports = () => {
  if (process.env.NODE_ENV === "test") {
    mongoose
      .connect("mongodb://localhost:27017/tests")
      .then(() => {
        logger.info("Connected to MongoDB...");
      })
      .catch((err) => {
        logger.error("Failed to connect to MongoDB", err.message);
      });
  } else {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        logger.info("Connected to MongoDB...");
      })
      .catch((err) => {
        logger.error("Failed to connect to MongoDB", err.message);
      });
  }
};
