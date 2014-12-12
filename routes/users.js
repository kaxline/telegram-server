var _ = require('lodash');

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

module.exports = {

  findAll: function (req, res) {
    var response = {
      users: users
    }
    res.json(response);
  },

  findById: function (req, res) {
    var userId = req.params.user_id;
    var foundUser = _.where(users, {id: userId})[0];
    var response = {
      user: foundUser
    };
    res.json(response);
  }

}