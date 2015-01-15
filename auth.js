var logger = require('nlogger').logger(module);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var findUserById = require('./utils').findUserById;

// START PASSPORT CONFIG

passport.serializeUser(function (user, done) {
  logger.info('in serialize user where user: ', user);
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  logger.info('in deserialize user where id: ', id);
  done(null, findUserById(id));
});

passport.use(new LocalStrategy(
  function (username, password, done) {
    logger.info('username: ', username);
    logger.info('password: ', password);
    var foundUser = findUserById(username);
    if (foundUser) {
      if (foundUser.password === password) {
        return done(null, foundUser);
      } else {
        return done(null, false, {message: 'Invalid password.'})
      }
    } else {
      return done(null, false, {message: 'No user found with that username.'})
    }
  }
));


// END PASSPORT CONFIG

module.exports = passport;