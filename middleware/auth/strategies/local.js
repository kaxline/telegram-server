var logger = require('../../../log');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../../mongodb').model('User');

passport.use(new LocalStrategy({
    usernameField: 'userId'
  },
  function (username, password, done) {
    logger.info('username: ', username);
    logger.info('password: ', password);
    User.findOne({id: username}, function (err, foundUser) {
      if (err) {
        return done(err, false);
      }
      foundUser.comparePassword(password, function (err, isMatch) {
        if (err) {
          return done(null, false, {message: 'Invalid password.'});
        } else {
          return done(null, foundUser, {message: 'User found and password matches'});
        }
      });
    });
  }
));

module.exports = passport;