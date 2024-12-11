// Router Authentication
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('./auth/login.hbs', { title: 'Login FTICampusHub' });
});

router.get('/register', function(req, res, next) {
  res.render('./auth/register.hbs', { title: 'Register FTICampusHub' });
});

router.get('/forgot_password', function(req, res, next) {
  res.render('./auth/forgot_password.hbs', { title: 'Forgot Password' });
});

module.exports = router;
