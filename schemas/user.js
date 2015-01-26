var mongoose = require('mongoose')
  , logger = require('../log')
  , _ = require('lodash')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , bcrypt = require('bcrypt');

var userSchema = new Schema({
    id: String
  , name: String
  , email: String
  , profileImage: String
  , password: String
  , followers: [{type: ObjectId, ref: 'User'}]
});

userSchema.methods.toEmber = function () {
  return _.omit(this, ['password', 'email']);
};

userSchema.methods.comparePassword = function (submittedPassword, done) {
  logger.info({user: this});
  logger.info('database password: ', this.password);
  bcrypt.compare(submittedPassword, this.password, function (err, isMatch) {
    if (err) return done(err);
    done(null, isMatch);
  })
};

userSchema.pre('save', function (next) {
  var user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.hash(user.password, 8, function (err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

module.exports = userSchema;