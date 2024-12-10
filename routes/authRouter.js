// Router Authentication
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('./auth/login.hbs', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
  res.render('./auth/register.hbs', { title: 'Express' });
});

router.get('/forgot_password', function(req, res, next) {
  res.render('./auth/forgot_password.hbs', { title: 'Express' });
});

module.exports = router;
