const logger = require("../logs/logger");
require("dotenv").config();
module.exports = () => {
  if (!process.env.JWT_SECRET) {
    logger.error("FATAL ERROR: jwt secret key not defined");
    process.exit(1);
  }
};
