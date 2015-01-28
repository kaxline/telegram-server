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
  , follows: [{type: ObjectId, ref: 'User'}]
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

userSchema.methods.follow = function (userId, done) {
  var self = this;
  self.model('User').findOne({id: userId}, function (err, foundUser) {
    if (err) return done(err);
    if (!foundUser) return done({error: 'No user found.'});
    foundUser.followers.addToSet(self._id);
    foundUser.save(function (err, savedUser) {
      if (err) return done(err);
      self.follows.addToSet(savedUser._id);
      self.save(function (err, savedSelf) {
        if (err) return done(err);
        return done(null, savedSelf, savedUser);
      });
    });
  });
};

userSchema.methods.unfollow = function (userId, done) {
  var self = this;
  self.model('User').findOne({id: userId}, function (err, foundUser) {
    if (err) return done(err);
    if (!foundUser) return done({error: 'No user found.'});
    foundUser.followers.pull(self._id);
    foundUser.save(function (err, savedUser) {
      if (err) return done(err);
      self.follows.pull(savedUser._id);
      self.save(function (err, savedSelf) {
        if (err) return done(err);
        return done(null, savedSelf, savedUser);
      });
    });
  })
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