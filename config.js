var nconf = require('nconf')
  , path = require('path');

nconf.env();

if (nconf.get('NODE_ENV') == 'production') {
  nconf.file({
    file: path.join(__dirname, 'config/config-prod.json')
  });
} else {
  nconf.file({
    file: path.join(__dirname, 'config/config-dev.json')
  });
}

module.exports = nconf;