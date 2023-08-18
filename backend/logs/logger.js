const loggerInfo = require("./loggerInfo");

let logger = null;

if (process.env.NODE_ENV !== "production") {
  logger = loggerInfo();
}

module.exports = logger;
