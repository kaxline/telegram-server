var users = require('./routes/users');
var posts = require('./routes/posts');

module.exports = function (app) {
  // Route implementation
  app.get('/api/users', users.findAll);

  app.get('/api/users/:user_shortname', users.findById);

  app.get('/api/posts', posts.findAll);
}