var logger = require('nlogger').logger(module);
var _ = require('lodash');
var users = require('./fixture-data/users');

module.exports = {

  makeEmberUser: function (user) {
    return _.omit(user, ['password', 'email']);
  },

  findUserById: function (id) {
    return _.where(users, {id: id})[0];
  },

  ensureAuthenticated: function (req, res, next) {
    logger.info('isAuthenticated: ', req.isAuthenticated());
    logger.info('req.user: ', req.user);
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.sendStatus(403);
    }
  }

};