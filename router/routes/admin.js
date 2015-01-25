var express = require('express')
  , router = express.Router()
  , logger = require('../../log')


router.get('/logout', function (req, res) {
  req.logout();
  res.sendStatus(200);
});

module.exports = router;