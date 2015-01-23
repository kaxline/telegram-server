var nconf = require('nconf')
  , path = require('path');

nconf.env();

console.log(path.join(__dirname, 'config/config-dev.json'));

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