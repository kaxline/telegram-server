var bodyParser = require('body-parser')
  , session = require('express-session')
  , cookieParser = require('cookie-parser')
  , logger = require('../log')
  , passport = require('./auth')
  , db = require('../mongodb')
  , MongoStore = require('connect-mongo')(session);

function configureSession (session) {
  return session({
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
  });
}

module.exports = function (app) {
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(configureSession(session));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(function (req, res, next) {
    logger.info(req.method, ' - ', req.path);
    next();
  });
}