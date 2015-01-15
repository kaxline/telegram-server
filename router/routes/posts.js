var express = require('express');
var router = express.Router();
var _ = require('lodash');
var logger = require('nlogger').logger(module);
var posts = require('../../fixture-data/posts');
var ensureAuthenticated = require('../../utils').ensureAuthenticated;



router.get('/', function (req, res) {
  var response = {
    posts: posts
  }
  res.send(response);
});

router.get('/:post_id', function (req, res) {
  var postId = parseInt(req.params.post_id);
  logger.info('post id is ', postId);
  var foundPost = _.where(posts, {id: postId});
  var response = {
    post: foundPost
  };
  res.send(response);
});

router.post('/', ensureAuthenticated, function (req, res) {
  var newPost = req.body.post;
  logger.info(req.body);
  newPost.id = posts.length + 5;
  posts.push(newPost);
  var newPostResponse = {
    post: newPost
  };
  res.send(newPostResponse);
});

module.exports = router;