var logger = require('../log')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var postSchema = new Schema({
    content: String
  , author: String
  , createdAt: Date
  , originalPost: {type: ObjectId, ref: 'Post'}
  , originalAuthorName: String
});

module.exports = postSchema;