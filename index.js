const express = require("express");
const bodyParser = require("body-parser");
const user = require("./routes/user");
const profile = require("./routes/profile");
const InitiateMongoServer = require("./config/db");

// Initiate Mongo Server
InitiateMongoServer();

const app = express();

// PORT
const PORT = process.env.PORT || 4000;

require('dotenv').config({ debug: process.env.DEBUG });

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});


/**
 * Router Middleware
 * Router - /user/*
 * Router - /profile/*
 * Method - *
 */
app.use("/user", user);
app.use("/profile", profile);

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});