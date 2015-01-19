var logger = require('bunyan').createLogger({name: 'auth.js'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var UserProvider = require('./userprovider');
var userProvider = new UserProvider;

// START PASSPORT CONFIG

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  userProvider.findById(id, '', function (err, user) {
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
    userProvider.findById(username, '', function (err, foundUser) {
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