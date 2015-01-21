var logger = require('./log');
var _ = require('lodash');

module.exports = {

  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.sendStatus(403);
    }
  }

};