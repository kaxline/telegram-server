var express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , session = require('express-session')
  , cookieParser = require('cookie-parser')
  , logger = require('./log')
  , passport = require('./auth')
  , db = require('./mongodb')
  , MongoStore = require('connect-mongo')(session);

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
    },
    store: new MongoStore({
      mongooseConnection: db
    })
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