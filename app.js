const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const sqlImport = require("./cron-job");

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server started by using port ${port}`);
});
