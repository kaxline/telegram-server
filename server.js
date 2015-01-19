var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('bunyan').createLogger({name: 'telegram'});
var passport = require('./auth');
var db = require('./mongodb');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    secret: 'yachtcopter',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      secure: false
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  logger.info(req.method, ' - ', req.path);
  next();
});

require('./router')(app);

var server = app.listen(3000, function () {
  logger.info('Listening on port ', server.address().port);
});