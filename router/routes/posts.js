var express = require('express');
var router = express.Router();
var _ = require('lodash');
var logger = require('../../log');
var Post = require('../../mongodb').model('Post');
var ensureAuthenticated = require('../../middleware/ensureAuth');

router.get('/', function (req, res) {
  Post.find({}, function (err, posts) {
    if (err) {
      logger.error(err);
      return res.sendStatus(500);
    }
    res.send({posts: posts});
  });
});

router.get('/:post_id', function (req, res) {
  var postId = req.params.post_id;
  logger.info({postId: postId});
  Post.findById(postId, function (err, foundPost) {
    if (err) {
      logger.error(err);
      return res.sendStatus(500);
    }
    res.send({post: foundPost});
  })
});

router.post('/', ensureAuthenticated, function (req, res) {
  var newPost = req.body.post;
  var user = req.user;
  logger.info({newPost: newPost});
  if (user.id !== newPost.author) {
    return res.sendStatus(403);
  }
  var post = new Post(_.pick(newPost, ['content', 'author', 'orignalPost', 'originalAuthorName']));
  post.createdAt = new Date();
  post.save(function (err, savedPost) {
    if (err) {
      logger.error(err);
      return res.sendStatus(500);
    }
    res.send({post: savedPost});
  });
});

router.delete('/:post_id', ensureAuthenticated, function (req, res) {
  var postId = req.params.post_id;
  Post.remove({ _id : postId }, function (err) {
    if (err) {
      logger.error(err);
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  });
});

module.exports = router;