var logger = require('../log');
var mongoose = require('mongoose');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var postSchema = new Schema({
    content: String
  , author: String
  , createdAt: Date
  , originalPost: {type: ObjectId, ref: 'Post'}
  , originalAuthorName: String
});

module.exports = postSchema;