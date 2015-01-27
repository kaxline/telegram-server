var fs = require('fs')
  , logger = require('../log')
  , User = require('../mongodb').model('User')
  , nconf = require('../config')
  , api_key = nconf.get('mailgun:api_key')
  , domain = nconf.get('mailgun:domain')
  , mailgun = require('mailgun-js')({apiKey: api_key, domain: domain})
  , Handlebars = require('handlebars')
  , generatePassword = require('password-generator')
  , md5 = require('MD5');

var emailSource = fs.readFileSync(__dirname + '/../templates/password-reset.hbs').toString();

var template = Handlebars.compile(emailSource);

function sendPasswordResetEmail (req, res) {
  var email = req.body.user.email;
  User.findOne({email: email}, function (err, foundUser) {
    if (err) {
      logger.error(err)
      return res.sendStatus(500);
    }
    if (!foundUser) {
      return res.sendStatus(500);
    }
    logger.info({foundUser: foundUser});
    var newPassword = generatePassword(12, false);
    foundUser.password = md5(newPassword);
    foundUser.save(function (err, savedUser) {
      if (err) {
        logger.error(err);
        return res.sendStatus(500);
      }
      var emailHTML = template({password: newPassword});
      var emailText = 'Hey there, Your new password is ' + newPassword + '. All the best, The Telegram App Team';
      logger.info(emailText);
      var data = {
        from: 'Telegram <postmaster@sandbox1772126ce30d4f1aa2291380e6b387ab.mailgun.org>'
        , to: email
        , subject: 'Your password has been reset'
        , text: emailText
        , html: emailHTML
      };
      mailgun.messages().send(data, function (err, body) {
        if (err) {
          logger.error(err);
          return res.sendStatus(500)
        }
        res.send({user: savedUser});
      });
    });
  });
}

module.exports = sendPasswordResetEmail;