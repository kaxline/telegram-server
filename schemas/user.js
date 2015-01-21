var mongoose = require('mongoose')
  , _ = require('lodash');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var userSchema = new Schema({
    id: String
  , name: String
  , email: String
  , profileImage: String
  , password: String
});

userSchema.statics.toEmber = function (user) {
  return _.omit(user, ['password', 'email']);
};

module.exports = userSchema;