// import package
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const kambuhRouter = require("./api/router/kambuhRouter");
const authRouter = require("./api/router/authRouter");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

//middlewate
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
// tes git
// Header
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Header", "Origin, Content-Type, Accept, Authorization, X-Requested-Width");
//     if(req.method === 'OPTIONAL'){
//         res.header('Access-Control-Allow-Method', 'POST, PUT, PATCH, DELETE');
//         return res.status(201).json({});
//     }
//     next();
// });

//router
app.use("/kambuh", kambuhRouter);
app.use("/auth", authRouter);

// error handling
// declare error
app.use((req, res, next) => {
  const error = new Error();
  error.status = 404;

  // pass error as a parameter
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: "Not Found",
    },
  });
  console.log(error);
});

module.exports = app;
