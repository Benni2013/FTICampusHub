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
router.get('/editprofile', async (req, res, next) => {
  try {
      let user_id = req.query.user;
      let user = await Users.findOne({ where: { user_id } });

      res.render('./editprofile.hbs', { 
          title: 'Edit Profile', 
          layout: "layouts/main",
          data: { user }
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error occurred' });
  }
});

router.post("/editprofile", async function (req, res, next) {
  try {
    let user_id = req.query.user;
    const { nama, nim, email, no_telp } = req.body;
    console.log("---------------" + user_id + nama, nim , email, no_telp);
    
    // Perbarui status di database
    const updated = await Users.update({ no_telp }, { where: { user_id } });

    if (updated[0] === 0) {
      return res.status(404).send("Pendaftaran tidak ditemukan.");
    }

    // Redirect dengan menyertakan query parameters
    res.redirect(`profile?user=${user_id}`);
  } catch (error) {
    console.error("Error saat memperbarui status pendaftaran:", error);
    res.status(500).send("Terjadi kesalahan saat memperbarui status.");
  }
});
module.exports = router;
