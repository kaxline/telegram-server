var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var logger = require('nlogger').logger(module);
var passport = require('passport');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(multer());
app.use(
  session({
    secret: 'yachtcopter',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(function (req, res, next) {
  logger.info(req.method, ' - ', req.path);
  next();
});

require('./router')(app);

var server = app.listen(3000, function () {
  logger.info('Listening on port ', server.address().port);
});