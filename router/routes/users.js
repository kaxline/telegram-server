var express = require('express');
var router = express.Router();
var _ = require('lodash');
var logger = require('nlogger').logger(module);

var users = [
  {
    id: 'kaxline',
    name: 'Keith Axline',
    email: 'kaxline@gmail.com',
    profileImage: '',
    password: 'password1'
  },
  {
    id: 'jsmith',
    name: 'Joe Smith',
    email: 'joe.smith@gmail.com',
    profileImage: '',
    password: 'password1'
  },
  {
    id: 'sjackson',
    name: 'Sam Jackson',
    email: 'sam.jackson@gmail.com',
    profileImage: '',
    password: 'password1'
  }
];

function makeEmberUser (user) {
  return _.omit(user, ['password', 'email']);
}

router.get('/', function (req, res) {
  var userId = req.query.userId;
  var password = req.query.password;
  if (!userId && !password) {
    var getUsersResponse = {
      users: users
    };
    res.json(getUsersResponse);
  }
  if (!userId) {
    logger.error('User attempted to login with a password but no username.');
  }
  if (!password) {
    logger.error('User attempted to login with a username but no password.');
  }
  var foundUser = _.where(users, {id: userId})[0];
  logger.info('foundUser.password: ', foundUser);
  if (foundUser.password === password) {
    var loginResponse = {
      users: [makeEmberUser(foundUser)]
    };
    res.json(loginResponse);
  } else {
    res.json({
      errors: {
        password: ['Invalid password']
      }
    });
  }
});

router.get('/:user_id', function (req, res) {
  var userId = req.params.user_id;
  var foundUser = _.where(users, {id: userId})[0];
  var response = {
    user: foundUser
  };
  logger.info(foundUser);
  res.json(response);
});

router.post('/', function (req, res) {
  var newUser = req.body.user;
  logger.info(req.body.user);
  users = users.push(newUser);
  newUserResponse = {
    users: [makeEmberUser(newUser)]
  };
  res.json(newUserResponse);
});

module.exports = router;