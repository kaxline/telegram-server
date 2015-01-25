var logger = require('../../../log');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../../mongodb').model('User');

passport.use(new LocalStrategy(function (username, password, done) {
    logger.info('submitted username: ', username);
    logger.info('submitted password: ', password);
    User.findOne({id: username}, function (err, foundUser) {
      if (err) {
        return done(err, false);
      }
      foundUser.comparePassword(password, function (err, isMatch) {
        if (err) {
          return done(err, false, {message: 'Invalid password.'});
        } else {
          return done(null, foundUser, {message: 'User found and password matches'});
        }
      });
    });
  }
));

module.exports = passport;