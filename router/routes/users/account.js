var sendPasswordResetEmail = require('../../../utils/email').sendPasswordResetEmail
  , passport = require('passport')
  , User = require('../../../mongodb').model('User')
  , _ = require('lodash')
  , logger = require('../../../log');

function loginWithPassport(req, res, next, done) {
  passport.authenticate('local', function (err, user, info) {
    logger.info('in passport.authenticate where info: ', info);
    if (err) {
      logger.info('in passport.authenticate with err: ', err);
      return res.sendStatus(500);
    }
    if (!user) {
      logger.info('in passport.authenticate with !user');
      return res.sendStatus(403);
    }
    req.login(user, function (err) {
      if (err) {
        return next(err)
      }
      logger.info('req.user: ', req.user);
      logger.info('req.isAuthenticated: ', req.isAuthenticated());
      done(user);
    });
  })(req, res, next);
};

module.exports = {

  isUserAuthenticated: function (req, res) {
    var isAuthenticatedResponse = {};
    isAuthenticatedResponse.users = (req.isAuthenticated()) ? [req.user.toEmber()] : [];
    res.send(isAuthenticatedResponse);
  },

  signup: function (req, res, user) {
    var newUser = new User(_.pick(user, ['id', 'name', 'email', 'profileImage']));
    newUser.password = user.meta.password;
    newUser.save(function (err, savedUser) {
      if (err) {
        logger.error(err);
        return res.sendStatus(500);
      }
      logger.info('user saved to mongodb successfully');
      req.login(savedUser, function (err) {
        if (err) {
          logger.error(err);
          return res.sendStatus(500);
        }
        res.send({user: savedUser.toEmber()});
      });
    });
  },

  login: function (req, res, next) {
    loginWithPassport(req, res, next, function (user) {
      res.send({users: [user.toEmber()]});
    });
  },

  resetPassword: function (req, res) {
    var user = req.body.user;
    User.findOne({email: user.email}, function (err, foundUser) {
      if (err) {
        logger.error(err)
        return res.sendStatus(500);
      }
      if (!foundUser) {
        return res.sendStatus(404);
      }
      foundUser.resetPassword(function (err, plainTextPassword) {
        if (err) {
          logger.error(err)
          return res.sendStatus(500);
        }
        sendPasswordResetEmail(user, plainTextPassword, function (err, body) {
          if (err) {
            logger.error(err);
            return res.sendStatus(500)
          }
          res.send({user: foundUser});
        });
      });
    });
  }
};