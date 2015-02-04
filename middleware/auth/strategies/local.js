var logger = require('../../../log')
  , User = require('../../../mongodb').model('User')
  , LocalStrategy = exports;

LocalStrategy.options = {
    usernameField: 'user[id]'
  , passwordField: 'user[meta][password]'
};

LocalStrategy.verify = function (id, password, done) {
  logger.info('submitted username: ', id);
  logger.info('submitted password: ', password);
  User.matchUser(id, password, done);
};