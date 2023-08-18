const express = require("express");
const router = express.Router();
const { Users } = require("../models/users");
const authorizeUser = require("../middleware/auth");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const getReferences = async (tasks, currentUserID) => {
  let decoded = "",
    getTaskAdminUser = "",
    referenceTaskToBeAdded = "";

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i]?.referralTaskID) {
      decoded = jwt.verify(tasks[i]?.referralTaskID, process.env.TASK_REFERRAL);
      if (decoded._id !== currentUserID) {
        getTaskAdminUser = await Users.findById(decoded._id);
        referenceTaskToBeAdded = getTaskAdminUser?.tasks?.find(
          (referenceTask) =>
            referenceTask.referralTaskID === tasks[i]?.referralTaskID
        );
        tasks.splice(i, 1, referenceTaskToBeAdded);
      }
      decoded = "";
    }
  }
  return tasks;
};

router.get(
  "/",
  authorizeUser,
  asyncErrorHandler(async (req, res) => {
    const currentUser = await Users.findById(req.user._id);
    if (!currentUser)
      return res
        .status(404)
        .json({ msg: "No information about the user exists!" });

    let tasks = JSON.parse(JSON.stringify(currentUser.tasks));

    const newTasksWithReferences = await getReferences(tasks, req.user._id);
    newTasksWithReferences.filter((task) => delete task.comments);

    const todaysDate = dateFormatter(new Date());

    if (currentUser.notifDate !== todaysDate) {
      const lastActiveDate = readableFormatter(currentUser.notifDate);

      const lastActiveTaskList = newTasksWithReferences.filter(
        (task) => task.taskStartDate === currentUser.notifDate
      );
      const todaysTaskListLength = newTasksWithReferences.reduce(
        (count, task) => count + (task.taskStartDate === todaysDate ? 1 : 0),
        0
      );

      await taskNotifier(
        lastActiveTaskList,
        todaysTaskListLength,
        currentUser,
        lastActiveDate,
        todaysDate
      );
    }

    const totalNumberOfNotifs = currentUser.notifications.length;

    res.status(200).json({
      name: currentUser.name,
      email: currentUser.email,
      tasks: newTasksWithReferences,
      profileImage: currentUser.profileImage ?? currentUser.profileImage,
      totalNumberOfNotifs,
    });
  })
);

const dateFormatter = (date) => {
  if (!(date instanceof Date)) {
    throw new Error('Invalid "date" argument. You must pass a date instance');
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const readableFormatter = (date) => {
  return new Date(date).toDateString().split(" ").slice(1).join(" ");
};

const taskNotifier = async (
  lastActiveTaskList,
  todaysTaskListLength,
  currentUser,
  lastActiveDate,
  todaysDate
) => {
  const incompletedTaskCount = lastActiveTaskList.reduce(
    (count, task) => count + (!task.isCompleted ? 1 : 0),
    0
  );

  if (incompletedTaskCount > 0) {
    currentUser.notifications.unshift({
      notifMessage: `Reminder: You have ${incompletedTaskCount} incomplete ${
        incompletedTaskCount === 1 ? "task" : "tasks"
      } for <span class=colored>${lastActiveDate}</span>. Take a moment to catch up!`,
      createdAt: new Date().getTime(),
      tag: "Incompleted Tasks",
    });
  }
  currentUser.notifications.unshift({
    notifMessage: `You have got ${
      todaysTaskListLength === 0
        ? "no tasks"
        : todaysTaskListLength === 1
        ? `${todaysTaskListLength} task`
        : `${todaysTaskListLength} tasks`
    } today!`,
    createdAt: new Date().getTime(),
    tag: "Today's Tasks",
  });
  currentUser.notifDate = todaysDate;
  await currentUser.save();
};

module.exports = {
  getUserInfo: router,
  dateFormatter,
};
