const bcrypt = require("bcrypt");
const { Users } = require("../models/users");
const authorizeUser = require("../middleware/auth");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

router.put(
  "/",
  authorizeUser,
  asyncErrorHandler(async (req, res) => {
    const { error } = validateProfile(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const userWhosProfileIsToBeUpdated = await Users.findById(req.user._id);
    if (!userWhosProfileIsToBeUpdated)
      return res.status(404).send("User not found!");

    userWhosProfileIsToBeUpdated.name = req.body.name
      ? req.body.name
      : userWhosProfileIsToBeUpdated.name;
    userWhosProfileIsToBeUpdated.email = req.body.email
      ? req.body.email
      : userWhosProfileIsToBeUpdated.email;
    userWhosProfileIsToBeUpdated.password = req.body.password
      ? req.body.password
      : userWhosProfileIsToBeUpdated.password;
    userWhosProfileIsToBeUpdated.profileImage = req.body.profileImage
      ? req.body.profileImage
      : userWhosProfileIsToBeUpdated.profileImage;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      userWhosProfileIsToBeUpdated.password = await bcrypt.hash(
        userWhosProfileIsToBeUpdated.password,
        salt
      );
    }
    await userWhosProfileIsToBeUpdated.save();
    res.status(200).json({
      msg: "Changes saved successfully!",
      name: userWhosProfileIsToBeUpdated.name,
      email: userWhosProfileIsToBeUpdated.email,
      profileImage: userWhosProfileIsToBeUpdated.profileImage,
    });
  })
);

const validateProfile = (incomingEditProfileReq) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).allow(""),
    email: Joi.string().min(5).max(255).email().allow(""),
    password: Joi.string().min(5).max(255).allow(""),
    profileImage: Joi.string().allow(""),
  });

  return schema.validate(incomingEditProfileReq);
};

module.exports = router;
