var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var upload = require("express-fileupload");

var clientApiRouter = require("./routes/client-api");
var adminApiRouter = require("./routes/admin-api");

var commonApiRouter = require("./routes/common-api");

require("dotenv").config();

var app = express();

var allowCrossDomain = function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin, x-access-token, Access-Control-Allow-Credentials"
  );

  var allowedOrigins = [
    "http://127.0.0.1:8080",
    "http://localhost:8080",
    "http://127.0.0.1:8081",
    "http://localhost:8081",
    "http://127.0.0.1:9000",
    "http://localhost:9000",
    "https://music-life.herokuapp.com",
    "http://music-life.herokuapp.com",
    "https://my-audio-46a92.firebaseapp.com",
  ];
  var origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  console.log();
  next();
};
app.use(allowCrossDomain);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(
  upload({
    useTempFiles: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/client", clientApiRouter);
app.use("/api/admin", adminApiRouter);
app.use("/api", commonApiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(3000, () => {
  console.log("Server listening at %s:%d ", app.get("host"), app.get("port"));
});

module.exports = app;
