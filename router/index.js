module.exports = function (app) {

  // USERS

  app.use('/api/users', require('./routes/users'));

  // POSTS

  app.use('/api/posts', require('./routes/posts'));

};