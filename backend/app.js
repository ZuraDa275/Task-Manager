const logger = require("./logs/logger");
const express = require("express");
const app = express();

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/uncaughtException")();

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  logger.info(`Listening on port ${port}.....`);
});

module.exports = server;
