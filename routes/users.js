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
    console.log('users');
    res.json(users);
  },

  findById: function (req, res) {
    var userShortname = req.params.user_shortname;
    var foundUser = _.where(users, {id: userShortname})[0];
    var test = {
      user: foundUser
    };
    console.log(foundUser);
    res.json(test);
  }

}