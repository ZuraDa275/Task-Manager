const { Users } = require("../models/users");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const authorizeUser = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.post(
  "/",
  authorizeUser,
  asyncErrorHandler(async (req, res) => {
    const currentUser = await Users.findById(req.user._id);
    if (!currentUser)
      return res
        .status(404)
        .json({ msg: "No information about the user exists!" });
    const search = req.body.search;
    let searchedUser = await Users.find({
      name: { $regex: `^${search}+`, $options: "i" },
    })
      .select("name")
      .limit(10);

    if (searchedUser.length === 0)
      return res.status(404).json({ msg: "User doesn't exist" });

    if (searchedUser.find((user) => user.name === currentUser.name)) {
      searchedUser = searchedUser.filter(
        (user) => user.name !== currentUser.name
      );
    }
    res.status(200).json({ userList: searchedUser });
  })
);
module.exports = router;
