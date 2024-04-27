"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
var cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const webHookRoutes = require("./routes/webHookRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

const { urlencoded, json } = require("body-parser");

dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  console.log("1");
  res.status(200).send({ message: "success" });
});

app.use("/", webHookRoutes);


app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
