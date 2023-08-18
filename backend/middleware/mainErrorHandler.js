const logger = require("../logs/logger");

const mainErrorHandler = (err, req, res, next) => {
  logger.error(err, err.message);
  res.status(500).json({ msg: "Something failed, please try again later" });
};

module.exports = mainErrorHandler;
