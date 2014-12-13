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

router.get('/', function (req, res) {
  var response = {
    users: users
  };
  res.json(response);
});

router.get('/:user_id', function (req, res) {
  var userId = req.params.user_id;
  var foundUser = _.where(users, {id: userId})[0];
  var response = {
    user: foundUser
  };
  res.json(response);
});

module.exports = router;