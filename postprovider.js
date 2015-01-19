var logger = require('bunyan').createLogger({name: 'postprovider.js'});
var mongoose = require('mongoose');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var PostSchema = new Schema({
    content: String
  , author: String
  , createdAt: Date
  , originalPost: {type: ObjectId, ref: 'Post'}
});

mongoose.model('Post', PostSchema);
var Post = mongoose.model('Post');

var PostProvider = function () {
};

PostProvider.prototype.findAll = function (selections, done) {
  Post.find()
      .select(selections)
      .exec(function (err, posts) {
        done(null, posts);
      });
};

PostProvider.prototype.findById = function (id, selections, done) {
  Post.findOne({_id: id}, selections, function (err, post) {
    logger.info({foundPost: post});
    if (!err && !post) {
      done({error: 'No post found with id: ' + id});
    } else if (!err) {
      done(null, post);
    } else {
      done(err)
    }
  });
};

PostProvider.prototype.save = function (params, done) {
  var post = new Post({
      content: params['content']
    , author: params['author']
    , createdAt: params['createdAt']
    , originalPost: params['originalPost']
  });
  post.save(function (err, savedPost) {
    if (err) done(err);
    done(null, savedPost);
  });
};

module.exports = PostProvider;