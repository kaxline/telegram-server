var users = require('./routes/users');
var posts = require('./routes/posts');

module.exports = function (app) {

  // USERS

  app.get('/api/users', users.findAll);

  app.get('/api/users/:user_id', users.findById);

  // POSTS

  app.get('/api/posts', posts.findAll);

  app.get('/api/posts/:post_id', posts.findById);

  app.post('/api/posts', posts.createPost);

}