var User = require('../../../mongodb').model('User')
  , _ = require('lodash')
  , logger = require('../../../log');

module.exports = {

  findAllUsers: function (req, res) {
    User.find({}, 'name id profileImage', function (err, users) {
      if (err) {
        logger.error(err);
        return res.sendStatus(500);
      }
      res.send({users: users});
    });
  },

  findUserById: function (req, res) {
    var userId = req.params.user_id;
    logger.info({body: req.body});
    User.findOne({id: userId}, function (err, user) {
      if (err) {
        logger.error(err);
        return res.sendStatus(500);
      }
      if (!user) {
        logger.info('No user found with id:', userId);
        return res.sendStatus(404);
      }
      return res.send({user: user.toEmber(req.user)});
    });
  },

  followUser: function (req, res) {
    var user = req.user
      , userId = req.params.user_id;
    user.follow(userId, function (err, savedUser) {
      if (err) {
        logger.error(err);
        return res.sendStatus(500);
      }
      return res.send({user: savedUser.toEmber(user)});
    });
  },

  unfollowUser: function (req, res) {
    var user = req.user
      , userId = req.params.user_id;
    user.unfollow(userId, function (err, savedUser) {
      if (err) {
        logger.error(err);
        return res.sendStatus(500);
      }
      return res.send({user: savedUser.toEmber(user)});
    });
  },

  findFollowers: function (req, res) {
    var userId = req.query.userId;
    var requestUser = req.user;
    logger.info({requestUser: requestUser});
    User.findOne({id: userId})
      .populate('followers')
      .exec(function (err, foundUser) {
        if (err) {
          logger.error(err)
          return res.sendStatus(500);
        }
        var followersResponse = _.map(foundUser.get('followers'), function (user) {
          return user.toEmber(requestUser);
        });
        res.send({users: followersResponse});
      });
  },

  findFollowing: function (req, res) {
    var userId = req.query.userId;
    var requestUser = req.user;
    User.findOne({id: userId}, function (err, foundUser) {
      if (err) {
        logger.error(err)
        return res.sendStatus(500);
      }
      User.find({})
        .where('followers').in([foundUser.get('_id')])
        .exec(function (err, foundUsers) {
          if (err) {
            logger.error(err);
            return res.sendStatus(500);
          }
          var followingResponse = _.map(foundUsers, function (user) {
            return user.toEmber(requestUser);
          });
          res.send({users: followingResponse});
        });
    });
  }

};

