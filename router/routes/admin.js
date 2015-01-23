var express = require('express')
  , router = express.Router()
  , logger = require('../../log')
  , User = require('../../mongodb').model('User')
  , api_key = 'key-cc4ec9a29199453aa66ccf1637a04f0f'
  , domain = 'sandbox1772126ce30d4f1aa2291380e6b387ab.mailgun.org'
  , mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

router.get('logout', function (req, res) {
  req.logout();
  res.sendStatus(200);
});

router.get('/password-reset', function (req, res) {
  var email = req.query.email;
  var data = {
      from: 'Mailgun Sandbox <postmaster@sandbox1772126ce30d4f1aa2291380e6b387ab.mailgun.org>'
    , to: 'keith.axline@gmail.com'
    , subject: 'test'
    , text: 'testing'
  };
  mailgun.messages().send(data, function (err, body) {
    if (err) {
      logger.error(err);
      return res.sendStatus(500)
    }
    res.sendStatus(200);
  });
});

module.exports = router;