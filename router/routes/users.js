var express = require('express')
  , router = express.Router()
  , logger = require('../../log')
  , passport = require('../../middleware/auth')
  , User = require('../../mongodb').model('User')
  , _ = require('lodash')
  , sendPasswordResetEmail = require('../../utils/email')
  , ensureAuthenticated = require('../../middleware/ensureAuth');




function loginWithPassport (req, res, next, done) {
  passport.authenticate('local', function (err, user, info) {
    logger.info('in passport.authenticate where info: ', info);
    if (err) {
      logger.info('in passport.authenticate with err: ', err);
      return res.sendStatus(500);
    }
    if (!user) {
      logger.info('in passport.authenticate with !user');
      return res.sendStatus(403);
    }
    req.login(user, function (err) {
      if (err) {
        return next(err)
      }
      logger.info('req.user: ', req.user);
      logger.info('req.isAuthenticated: ', req.isAuthenticated());
      done(user);
    });
  })(req, res, next);
}

router.get('/', function (req, res, next) {
  var followQuery = req.query.follows;
  if (followQuery) {
    if (!req.user) {
      return res.sendStatus(403);
    }
    User.find({id: followQuery})
      .where('followers').in([req.user._id])
      .exec(function (err, foundUser) {
        if (err) {
          logger.error(err);
          return res.sendStatus(500);
        }
        logger.info({foundUser: foundUser});
        return res.send({users: [foundUser[0].toEmber()]});
      });
  } else if (req.query.isAuthenticated === 'true') {
    var isAuthenticatedResponse = {};
    isAuthenticatedResponse.users = (req.isAuthenticated()) ? [req.user.toEmber()] : [];
    res.send(isAuthenticatedResponse);
  } else {
    User.find({}, 'name id profileImage', function (err, users) {
      if (err) {
        logger.error(err);
        return res.sendStatus(500);
      }
      res.send({users: users});
    });
  }
});

router.get('/:user_id', function (req, res) {
  var userId = req.params.user_id;
  logger.info({body: req.body});
  User.findOne({ id: userId }, 'name id profileImage', function (err, user) {
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
});

router.put('/:user_id', ensureAuthenticated, function (req, res, next) {
  var userId = req.params.user_id;
  User.findOne({id: userId}, function (err, foundUser) {
    if (err) {
      logger.error(err);
      return res.sendStatus(500);
    }
    foundUser.followers.push(req.user._id);
    foundUser.save(function (err, saveduser) {
      if (err) {
        logger.error(err);
        return res.sendStatus(500);
      }
      res.send({user: saveduser.toEmber()});
    });
  });
});


router.post('/', function (req, res, next) {
  var user = req.body.user;
  var meta = user.meta;
  var operation = meta.operation;
  if (operation && operation === 'login') {
    req.body.username = user.id;
    req.body.password = meta.password;
    loginWithPassport(req, res, next, function (user) {
      res.send({users: [user.toEmber()]});
    });
  } else if (operation && operation === 'reset-password') {
    sendPasswordResetEmail(req, res);
  } else {
    var newUser = new User(_.pick(user, ['id', 'name', 'email', 'profileImage']));
    newUser.password = meta.password;
    newUser.save(function (err, savedUser) {
      if (err) {
        logger.error(err);
        return res.sendStatus(500);
      }
      logger.info('user saved to mongodb successfully');
      req.login(savedUser, function (err) {
        if (err) {
          logger.error(err);
          return res.sendStatus(500);
        }
        res.send({user: savedUser.toEmber()});
      });
    });
  }
});

module.exports = router;