var express = require('express')
  , router = express.Router()
  , logger = require('../../log')
  , User = require('../../mongodb').model('User')
  , api_key = 'key-cc4ec9a29199453aa66ccf1637a04f0f'
  , domain = 'sandbox1772126ce30d4f1aa2291380e6b387ab.mailgun.org'
  , mailgun = require('mailgun-js')({apiKey: api_key, domain: domain})
  , Handlebars = require('handlebars')
  , generatePassword = require('password-generator');

var emailSource = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\"> <html xmlns=\"http://www.w3.org/1999/xhtml\"><body> <p>Hey there,</p> <p>Your new password is {{password}}.</p> <br/> <p>All the best,</p> <p>The Telegram App Team</p> </body> </html>";

var template = Handlebars.compile(emailSource);

router.get('/logout', function (req, res) {
  req.logout();
  res.sendStatus(200);
});

router.get('/password-reset', function (req, res) {
  var email = req.query.email;
  User.findOne({email: email}, function (err, foundUser) {
    if (err) {
      logger.error(err)
      return res.sendStatus(500);
    }
    logger.info({foundUser: foundUser});
    var newPassword = generatePassword(12, false);
    foundUser.password = newPassword;
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
        res.sendStatus(200);
      });

    });


  });



});

module.exports = router;