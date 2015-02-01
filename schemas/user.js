var mongoose = require('mongoose')
  , logger = require('../log')
  , _ = require('lodash')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , bcrypt = require('bcrypt')
  , generatePassword = require('password-generator')
  , md5 = require('MD5');

var userSchema = new Schema({
    id: String
  , name: String
  , email: String
  , profileImage: String
  , password: String
  , followers: [{type: ObjectId, ref: 'User'}]
});

userSchema.methods.toEmber = function (loggedInUser) {
  var selfJSON = this.toJSON();
  if (loggedInUser && this.followers.indexOf(loggedInUser._id) !== -1) {
    logger.info('requesting user follows queried user.');
    selfJSON.isFollowed = true;
  }
  var toEmberResponse = _.omit(selfJSON, ['password', 'email']);
  logger.info({toEmberResponse: toEmberResponse});
  return toEmberResponse;
};

userSchema.methods.comparePassword = function (submittedPassword, done) {
  logger.info({user: this});
  logger.info('database password: ', this.password);
  bcrypt.compare(submittedPassword, this.password, function (err, isMatch) {
    if (err) return done(err);
    done(null, isMatch);
  })
};

userSchema.methods.follow = function (userId, done) {
  var self = this;
  self.model('User').findOneAndUpdate({id: userId}, {$addToSet: {followers: self._id}}, function (err, foundUser) {
    if (err) return done(err);
    if (!foundUser) return done({error: 'No user found.'});
    return done(null, foundUser);
  });
};

userSchema.methods.unfollow = function (userId, done) {
  var self = this;
  self.model('User').findOneAndUpdate({id: userId}, {$pull: {followers: self._id}}, function (err, foundUser) {
    if (err) return done(err);
    if (!foundUser) return done({error: 'No user found.'});
    return done(null, foundUser);
  });
};

userSchema.methods.resetPassword = function (done) {
  var self = this;
  var newPassword = generatePassword(12, false);
  bcrypt.hash(md5(newPassword), 8, function (err, hash) {
    if (err) return done(err);
    self.update({password: hash}, null, function (err, savedSelf) {
      if (err) return done(err);
      return done(null, newPassword);
    });
  });

};

userSchema.statics.matchUser = function (id, password, done) {
  this.findOne({id: id}, function (err, foundUser) {
    if (err) {
      return done(err, false);
    }
    foundUser.comparePassword(password, function (err, isMatch) {
      if (err || !isMatch) {
        return done(err, false, {message: 'Invalid password.'});
      } else {
        return done(null, foundUser, {message: 'User found and password matches'});
      }
    });
  });
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