const Joi = require("joi");
const { Users } = require("../models/users");
const authorizeUser = require("../middleware/auth");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const express = require("express");
const router = express.Router();

router.post(
  "/",
  authorizeUser,
  asyncErrorHandler(async (req, res) => {
    const { error } = validateNotifReq(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const currentUser = await Users.findById(req.user._id);

    if (!currentUser) return res.status(404).json({ msg: "User not found!" });

    const newNotifs = currentUser.notifications.slice(0, req.body.notifCount);
    res.status(200).json({
      msg: "New Notifications!",
      newNotifs,
    });
  })
);

const validateNotifReq = (incomingReq) => {
  const schema = Joi.object({
    notifCount: Joi.number().required(),
  });
  return schema.validate(incomingReq);
};
module.exports = router;
