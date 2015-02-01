var fs = require('fs')
  , logger = require('../log')
  , User = require('../mongodb').model('User')
  , nconf = require('../config')
  , api_key = nconf.get('mailgun:api_key')
  , domain = nconf.get('mailgun:domain')
  , mailgun = require('mailgun-js')({apiKey: api_key, domain: domain})
  , Handlebars = require('handlebars')
  , email = exports;

var emailHTMLSource = fs.readFileSync(__dirname + '/../templates/password-reset-html.hbs').toString();

var emailTextSource = fs.readFileSync(__dirname + '/../templates/password-reset-text.hbs').toString();

var templateHTML = Handlebars.compile(emailHTMLSource);

var templateText = Handlebars.compile(emailTextSource);

email.sendPasswordResetEmail = function (user, plainTextPassword, done) {
    var email = user.email;
    var emailHTML = templateHTML({password: plainTextPassword});
    var emailText = templateText({password: plainTextPassword});
    logger.info(emailText);
    var data = {
      from: 'Telegram <postmaster@sandbox1772126ce30d4f1aa2291380e6b387ab.mailgun.org>'
      , to: email
      , subject: 'Your password has been reset'
      , text: emailText
      , html: emailHTML
    };
    mailgun.messages().send(data, function (err, body) {
      if (err) return done(err);
      return done(null, body);
    });
};