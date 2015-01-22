var mongoose = require('mongoose')
  , _ = require('lodash')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10;

var userSchema = new Schema({
    id: String
  , name: String
  , email: String
  , profileImage: String
  , password: String
});

userSchema.methods.toEmber = function () {
  return _.omit(this, ['password', 'email']);
};

userSchema.methods.comparePassword = function (submittedPassword, done) {
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

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });

});

module.exports = userSchema;