var logger = require('./log')
  , mongoose = require('mongoose')
  , userSchema = require('./schemas/user')
  , postSchema = require('./schemas/post')
  , nconf = require('./config');


mongoose.connect(nconf.get('database:host'));

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  logger.info('connected to mongodb');
});

db.model('User', userSchema);
db.model('Post', postSchema);

module.exports = db;
