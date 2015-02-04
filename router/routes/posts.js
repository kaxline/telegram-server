var express = require('express')
  , router = express.Router()
  , _ = require('lodash')
  , logger = require('../../log')
  , Post = require('../../mongodb').model('Post')
  , User = require('../../mongodb').model('User')
  , ensureAuthenticated = require('../../middleware/ensureAuth');

function getPostsByAuthor (req, res) {
  var author = req.query.author;
  Post.find({author: author}, function (err, foundPosts) {
    if (err) {
      logger.error(err);
      res.sendStatus(500);
    }
    return res.send({posts: foundPosts});
  });
}

function getStreamPosts (req, res) {
  if (!req.isAuthenticated()) {
    return res.sendStatus(403);
  }
  var requestUser = req.user;
  User.find({})
    .where('followers').in([requestUser._id])
    .exec(function (err, foundUsers) {
      if (err) return logger.error(err);
      var foundUsersIds = _.pluck(foundUsers, 'id');
      foundUsersIds.push(requestUser.get('id'));
      Post.find({})
        .where('author').in(foundUsersIds)
        .exec(function (err, foundPosts) {
          if (err) return logger.error(err);
          var usersResponse = _.map(foundUsers, function (user) {
            return user.toEmber(requestUser);
          });
          res.send({
            posts: foundPosts,
            users: usersResponse
          });
        });
    });
}

router.get('/', function (req, res) {
  var operation = req.query.operation;

  switch(operation) {
    case 'byAuthor':
      getPostsByAuthor(req, res);
      break;
    case 'fromFollowers':
      getStreamPosts(req, res);
      break;
    default:
      res.sendStatus(403);
  }

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
  var post = new Post(_.pick(newPost, ['content', 'author', 'originalPost', 'originalAuthorName']));
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