const logger = require("../logs/logger");

module.exports = () => {
  process.on("uncaughtException", (err) => {
    logger.error("There was an uncaught error", err);
    process.exit(1);
  });
};
