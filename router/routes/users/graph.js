var User = require('../../../mongodb').model('User')
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
    User.findOne({id: userId}, 'name id profileImage', function (err, user) {
      if (err) {
        logger.error(err);
        return res.sendStatus(500);
      }
      if (!user) {
        logger.info('No user found with id:', userId);
        return res.sendStatus(404);
      }
      res.send({user: user});
    });
  },

  doesUserFollow: function (req, res, followQuery) {
    if (!req.user) {
      return res.sendStatus(403);
    }
    User.find({id: followQuery})
      .where('followers').in([req.user._id])
      .exec(function (err, foundUsers) {
        if (err) {
          logger.error(err);
          return res.sendStatus(500);
        }
        if (!foundUsers.length) {
          return res.sendStatus(404);
        }
        logger.info({foundUser: foundUsers});
        return res.send({users: [foundUsers[0].toEmber()]});
      });
  },

  followUser: function (req, res) {
    var user = req.user
      , userId = req.params.user_id;
    user.follow(userId, function (err, savedSelf, savedUser) {
      if (err) {
        logger.error(err);
        return res.sendStatus(500);
      }
      return res.send({user: savedUser.toEmber()});
    });
  },

  unfollowUser: function (req, res) {
    var userId = req.params.user_id;
    logger.info('in unfollowUser');
    res.sendStatus(404);
  }

}

