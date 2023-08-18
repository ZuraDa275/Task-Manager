const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const { Users } = require("../models/users");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post(
  "/",
  asyncErrorHandler(async (req, res) => {
    const { error } = validateUserLogin(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });

    const user = await Users.findOne({ email: req.body.email });
    if (!user)
      return res.status(401).json({ msg: "INVALID EMAIL OR PASSWORD!" });

    const passwordCheck = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordCheck)
      return res.status(401).json({ msg: "INVALID EMAIL OR PASSWORD!" });

    const token = user.generateAuthToken();

    res
      .header("x-auth-token", token)
      .status(200)
      .json({ msg: "User login successful!" });
  })
);

const validateUserLogin = (userLogin) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(userLogin);
};

module.exports = router;
