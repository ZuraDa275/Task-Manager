const logger = require("../logs/logger");
const asyncErrorHandler = (funcToBeHandled) => {
  return async (req, res, next) => {
    try {
      await funcToBeHandled(req, res);
    } catch (error) {
      logger.error(error, error.message);
      next(error);
    }
  };
};

module.exports = asyncErrorHandler;
