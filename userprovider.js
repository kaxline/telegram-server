var logger = require('bunyan').createLogger({name: 'userprovider.js'});
var mongoose = require('mongoose');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    id            : String
  , name          : String
  , email         : String
  , profileImage  : String
  , password      : String
});

mongoose.model('User', UserSchema);
var User = mongoose.model('User');

var UserProvider = function () {};

UserProvider.prototype.findAll = function (selections, done) {
  User.find({}, selections, function (err, users) {
    done(null, users);
  });
};

UserProvider.prototype.findById = function (id, selections, done) {
  User.findOne( { id : id }, selections, function (err, user) {
    if (!err && !user) {
      done({error: 'No user found with that user_id.'});
    } else if (!err) {
      done(null, user);
    } else {
      done(err)
    }
  });
}

UserProvider.prototype.save = function (params, done) {
  var user = new User({
      id            : params['id']
    , name          : params['name']
    , email         : params['email']
    , profileImage  : params['profileImage']
    , password      : params['password']
  });
  user.save(function (err, savedUser) {
    if (err) done(err);
    done(null, savedUser);
  });
};

module.exports = UserProvider;