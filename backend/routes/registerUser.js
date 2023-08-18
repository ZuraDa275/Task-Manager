const bcrypt = require("bcrypt");
const { Users, validateUsers } = require("../models/users");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const { dateFormatter } = require("./getUserInfo");
const express = require("express");
const router = express.Router();

router.post(
  "/",
  asyncErrorHandler(async (req, res) => {
    const { error } = validateUsers(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });

    const alreadyRegisteredName = await Users.findOne({ name: req.body.name });

    if (alreadyRegisteredName)
      return res
        .status(422)
        .json({ msg: "User with the username already exists!" });

    const alreadyRegisteredEmail = await Users.findOne({
      email: req.body.email,
    });

    if (alreadyRegisteredEmail)
      return res.status(422).json({ msg: "User already registered!" });

    const newUser = new Users({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      notifDate: dateFormatter(new Date()),
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    await newUser.save();

    const token = newUser.generateAuthToken();

    res
      .header("x-auth-token", token)
      .status(200)
      .json({ msg: "User has been added successfully!" });
  })
);
module.exports = router;
