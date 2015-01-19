var logger = require('bunyan').createLogger({name: 'telegram'});
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  logger.info('connected to mongodb');
});

module.exports = db;
