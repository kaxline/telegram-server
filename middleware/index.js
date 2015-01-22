var bodyParser = require('body-parser')
  , session = require('express-session')
  , cookieParser = require('cookie-parser')
  , logger = require('../log')
  , passport = require('./auth')
  , db = require('../mongodb')
  , MongoStore = require('connect-mongo')(session);

module.exports = function (app) {
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
}