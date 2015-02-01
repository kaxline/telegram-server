var express = require('express')
  , router = express.Router()
  , graph = require('./graph')
  , account = require('./account')
  , ensureAuthenticated = require('../../../middleware/ensureAuth');

router.get('/', function (req, res) {
  var operation = req.query.operation;

  switch (operation) {
    case 'isAuthenticated':
      return account.isUserAuthenticated(req, res);
    case 'followers':
      return graph.findFollowers(req, res);
    case 'following':
      return graph.findFollowing(req, res);
    default:
      graph.findAllUsers(req, res);
  }

});

router.get('/logout', function (req, res) {
  req.logout();
  res.sendStatus(200);
});

router.get('/:user_id', function (req, res) {
  return graph.findUserById(req, res)
});

router.post('/', function (req, res, next) {
  var user = req.body.user
    , operation = (user.meta || {}).operation;

  switch(operation) {
    case 'signup':
      return account.signup(req, res, user);
    case 'login':
      return account.login(req, res, next);
    case 'passwordReset':
      return account.resetPassword(req, res);
    default:
      logger.error('Unknown operation -', operation);
      res.sendStatus(400);
  }

});

router.put('/:user_id', ensureAuthenticated, function (req, res, next) {
  var user = req.body.user
    , operation = (user.meta || {}).operation;

  switch (operation) {
    case 'follow':
      return graph.followUser(req, res);
    case 'unfollow':
      return graph.unfollowUser(req, res);
    default:
      logger.error('Unknown operation -', operation);
      res.sendStatus(400);
  }


});

module.exports = router;