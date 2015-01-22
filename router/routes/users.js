var express = require('express')
  , router = express.Router()
  , logger = require('../../log')
  , passport = require('../../middleware/auth')
  , User = require('../../mongodb').model('User')
  , _ = require('lodash');

function loginWithPassport (req, res, next, done) {
  passport.authenticate('local', function (err, user, info) {
    logger.info('in passport.authenticate where info: ', info);
    if (err) {
      logger.info('in passport.authenticate with err: ', err);
      res.sendStatus(500);
      return;
    }
    if (!user) {
      logger.info('in passport.authenticate with !user');
      res.sendStatus(403);
      return;
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
}


router.get('/', function (req, res, next) {
  var action = req.query.action;
  if (action === 'login') {
    loginWithPassport(req, res, next, function (user) {
      var loginResponse = {
        users: [user.toEmber()]
      };
      res.send(loginResponse);
    });
  } else if (req.query.isAuthenticated === 'true') {
    var isAuthenticatedResponse = {};
    isAuthenticatedResponse.users = (req.isAuthenticated()) ? [req.user.toEmber()] : [];
    res.send(isAuthenticatedResponse);
  } else {
    User.find({}, 'name id profileImage', function (err, users) {
      if (!err) {
        var getUsersResponse = {
          users: users
        };
        res.send(getUsersResponse);
      } else {
        logger.error(err);
        res.sendStatus(500);
      }
    });
  }
});

router.get('/:user_id', function (req, res) {
  var userId = req.params.user_id;
  User.findOne({ id: userId }, 'name id profileImage', function (err, user) {
    if (!err) {
      var response = {
        user: user
      };
      res.send(response);
    } else {
      logger.error(err);
      res.sendStatus(500);
    }
  });
});

router.post('/', function (req, res, next) {
  var newUser = req.body.user;
  var user = new User(_.pick(newUser, ['id', 'name', 'email', 'profileImage', 'password']));
  user.save(function (err, savedUser) {
    if (!err) {
      logger.info('user saved to mongodb successfully');
      req.body.userId = savedUser.id;
      req.body.password = savedUser.password;
      loginWithPassport(req, res, next, function () {
        var newUserResponse = {
          user: savedUser.toEmber()
        };
        res.send(newUserResponse);
      });
    } else {
      logger.error(err);
      res.sendStatus(500);
    }
  });
});

module.exports = router;