var passport = require('passport')
  , logger = require('../../log')
  , User = require('../../../mongodb').model('User')
  , local = require('./strategies/local')
  , Strategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findOne({id: id}, function (err, user) {
    if (err) {
      logger.error(err);
      return done(err);
    }
    done(null, user);
  });
});

passport.use(new Strategy(local.options, local.verify));

module.exports = passport;