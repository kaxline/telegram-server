module.exports = function (app) {

  // USERS

  app.use('/api/users', require('./routes/users'));

  app.use('/api/logout', function (req, res) {
    req.logout();
    res.sendStatus(200);
  });

  // POSTS

  app.use('/api/posts', require('./routes/posts'));

};