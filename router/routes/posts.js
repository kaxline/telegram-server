var express = require('express');
var router = express.Router();
var _ = require('lodash');
var logger = require('nlogger').logger(module);

var posts = [
  {
    id: 4,
    content: 'Body of post 1',
    author: 'kaxline',
    createdAt: new Date('01/14/14')
  },
  {
    id: 7,
    content: 'Bleep blop bloop',
    author: 'kaxline',
    createdAt: new Date('11/21/14')
  },
  {
    id: 8,
    content: 'Some stuff',
    author: 'kaxline',
    createdAt: new Date('11/22/14')
  },
  {
    id: 5,
    content: 'Body of post 2',
    author: 'jsmith',
    createdAt: new Date('11/13/14')
  },
  {
    id: 6,
    content: 'Body of post 3',
    author: 'sjackson',
    createdAt: new Date('11/15/14')
  }
];

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
  res.json(response);
});

router.post('/', function (req, res) {
  var newPost = req.body.post;
  newPost.id = posts.length + 5;
  posts.push(newPost);
  var newPostResponse = {
    post: newPost
  };
  res.json(newPostResponse);
});

module.exports = router;