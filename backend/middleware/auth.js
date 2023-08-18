const logger = require("../logs/logger");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const authorizeUser = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).json({
      msg: "Access Denied because the user does not have permission to access this resource",
    });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    logger.error(ex, ex.message);
    res.status(401).json({
      msg: "Access Denied because the user does not have permission to access this resource",
    });
  }
};

module.exports = authorizeUser;
