var express = require('express')
  , app = express()
  , logger = require('./log')
  , nconf = require('./config');

require('./middleware')(app);

require('./router')(app);

var server = app.listen(nconf.get('server:port'), function () {
  logger.info('Listening on port ', server.address().port);
});