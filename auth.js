var logger = require('./log');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./mongodb').model('User');

// START PASSPORT CONFIG

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findOne({ id: id }, function (err, user) {
    if (!err) {
      done(null, user);
    } else {
      logger.error(err);
      done(err);
    }
  });
});

passport.use(new LocalStrategy({
    usernameField: 'userId'
  },
  function (username, password, done) {
    logger.info('username: ', username);
    logger.info('password: ', password);
    User.findOne({ id: username }, function (err, foundUser) {
      if (!err) {
        if (foundUser.password === password) {
          return done(null, foundUser, {message: 'User found and password matches'});
        } else {
          return done(null, false, {message: 'Invalid password.'})
        }
      } else {
        return done(err, false);
      }
    });
  }
));


// END PASSPORT CONFIG

module.exports = passport;