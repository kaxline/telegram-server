var express = require('express')
  , app = express()
  , logger = require('./log');

require('./middleware')(app);

require('./router')(app);

var server = app.listen(3000, function () {
  logger.info('Listening on port ', server.address().port);
});