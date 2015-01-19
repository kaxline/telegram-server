var express = require('express');
var router = express.Router();
var _ = require('lodash');
var logger = require('bunyan').createLogger({name: 'routes/posts.js'});
var PostProvider = require('../../postprovider');
var postProvider = new PostProvider;
var ensureAuthenticated = require('../../utils').ensureAuthenticated;



router.get('/', function (req, res) {
  postProvider.findAll('', function (err, posts) {
    if (!err) {
      var response = {
        posts: posts
      };
      res.send(response);
    } else {
      logger.error(err);
      res.sendStatus(500);
    }
  });
});

router.get('/:post_id', function (req, res) {
  var postId = req.params.post_id;
  logger.info({postId: postId});
  postProvider.findById(postId, '', function (err, foundPost) {
    if (!err) {
      var response = {
        post: foundPost
      };
      res.send(response);
    } else {
      logger.error(err);
      res.sendStatus(500);
    }
  })
});

router.post('/', ensureAuthenticated, function (req, res) {
  var newPost = req.body.post;
  var user = req.user;
  logger.info({newPost: newPost});
  if (user.id !== newPost.author) {
    res.sendStatus(403);
    return;
  }
  postProvider.save(newPost, function (err, savedPost) {
    if (!err) {
      var newPostResponse = {
        post: savedPost
      };
      res.send(newPostResponse);
    } else {
      logger.error(err);
      res.sendStatus(500);
    }
  });
});

module.exports = router;