// Router Authentication
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('./auth/login.hbs', { title: 'FTI Campus Hub - Login' });
});

router.post('/login', )

module.exports = router;
