var express = require('express');
var router = express.Router();
var logger = require('nlogger').logger(module);
var passport = require('../../auth');
var users = require('../../fixture-data/users');
var makeEmberUser = require('../../utils').makeEmberUser;
var findUserById = require('../../utils').findUserById;




router.get('/', function (req, res, next) {
  var action = req.query.action;
  if (action === 'login') {
    // Passport requires req.body to have username and password or else the local strategy is not called.
    req.body.username = req.query.userId;
    req.body.password = req.query.password;
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
        var loginResponse = {
          users: [makeEmberUser(user)]
        };
        res.send(loginResponse);
      })
    })(req, res, next);
  } else {
    var getUsersResponse = {
      users: users
    };
    res.send(getUsersResponse);
  }
});

router.get('/:user_id', function (req, res) {
  var userId = req.params.user_id;
  var foundUser = findUserById(userId);
  var response = {
    user: foundUser
  };
  logger.info(foundUser);
  res.send(response);
});

router.post('/', function (req, res) {
  var newUser = req.body.user;
  logger.info(req.body.user);
  users.push(newUser);
  newUserResponse = {
    user: makeEmberUser(newUser)
  };
  res.send(newUserResponse);
});

module.exports = router;