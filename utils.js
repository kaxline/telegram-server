var logger = require('bunyan').createLogger({name: 'utils.js'});
var _ = require('lodash');

module.exports = {

  makeEmberUser: function (user) {
    return _.omit(user, ['password', 'email']);
  },

  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.sendStatus(403);
    }
  }

};