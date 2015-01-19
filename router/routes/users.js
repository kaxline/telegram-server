var express = require('express');
var router = express.Router();
var logger = require('bunyan').createLogger({name: 'routes/users.js'});
var passport = require('../../auth');
var utils = require('../../utils');
var UserProvider = require('../../userprovider');
var userProvider = new UserProvider;


router.get('/', function (req, res, next) {
  var action = req.query.action;
  if (action === 'login') {
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
        if (err) { return next(err) }
        logger.info('req.user: ', req.user);
        logger.info('req.isAuthenticated: ', req.isAuthenticated());
        var loginResponse = {
          users: [utils.makeEmberUser(user)]
        };
        logger.info({loginResponse: loginResponse});
        res.send(loginResponse);
      })
    })(req, res, next);
  } else if (req.query.isAuthenticated === 'true') {
    var isAuthenticatedResponse = {};
    isAuthenticatedResponse.users = (req.isAuthenticated()) ? [utils.makeEmberUser(req.user)] : [];
    res.send(isAuthenticatedResponse);
  } else {
    userProvider.findAll('name id profileImage', function (err, users) {
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
  userProvider.findById(userId, 'name id profileImage', function (err, user) {
    if (!err) {
      var response = {
        user: user
      };
      logger.info({response: response});
      res.send(response);
    } else {
      logger.error(err);
      res.sendStatus(500);
    }
  });
});

router.post('/', function (req, res) {
  var newUser = req.body.user;
  userProvider.save(newUser, function (err) {
    if (!err) {
      logger.info('user saved to mongodb successfully');
      var newUserResponse = {
        user: utils.makeEmberUser(newUser)
      };
      res.send(newUserResponse);
    } else {
      logger.error(err);
      res.sendStatus(500);
    }
  });
});

module.exports = router;