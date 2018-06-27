'use strict';

const express = require('express');
const app = express();
const routes = require('./routes');

const jsonParser = require("body-parser").json;
const logger = require("morgan");

app.use(logger("dev"));
app.use(jsonParser());

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/qa");

const db = mongoose.connection;

db.on("error", function(err) {
  console.error("connection error:", err);
});

db.once("open", function() {
  console.log("db connection successful");
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if(req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,DELET");
    return res.status(200).json({});
  }
  next();
});

app.use("/questions", routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error("Not found");
  err.status = 404;
  next(err);
});

//Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Express server is listening on port', port);
});
