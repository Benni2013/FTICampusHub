// Router Authentication
var express = require('express');
var router = express.Router();
const { Users } = require('../models/RelasiTabel');

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

router.get('/profile', async (req, res, next) => {
  try {
      let user_id = req.query.user;
      let user = await Users.findOne({ where: { user_id } });

      res.render('./profile.hbs', { 
          title: 'Profile', 
          layout: "layouts/main",
          data: { user }
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error occurred' });
  }
});

module.exports = router;
