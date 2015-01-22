var passport = require('passport')
  , logger = require('../../log')
  , User = require('../../mongodb').model('User');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findOne({id: id}, function (err, user) {
    if (!err) {
      done(null, user);
    } else {
      logger.error(err);
      done(err);
    }
  });
});

require('./strategies/local');

module.exports = passport;