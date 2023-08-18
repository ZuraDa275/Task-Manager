const logger = require("../logs/logger");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const commentHandler = (req, res, next) => {
  const referralTaskID = req.body?.referralTaskID;
  if (!referralTaskID)
    return res.status(401).json({
      msg: "Not authorized to comment",
    });
  try {
    const decoded = jwt.verify(referralTaskID, process.env.TASK_REFERRAL);
    req.commentInfo = decoded;
    next();
  } catch (ex) {
    logger.error(ex, ex.message);
    res.status(401).json({
      msg: "Not authorized to comment",
    });
  }
};

module.exports = commentHandler;
