// Router Authentication
var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Users } = require('../models/RelasiTabel');

// Buat direktori jika belum ada
const uploadDir = './public/pp_mahasiswa';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pp-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Error: Images Only!');
  }
});

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

router.post("/editprofile", upload.single('profile_picture'), async function (req, res, next) {
  try {
    let user_id = req.query.user;
    const { nama, nim, email, no_telp } = req.body;
    console.log("---------------" + user_id + nama, nim , email, no_telp);

    // Siapkan object untuk update
    let updateData = { nama, nim, email, no_telp };

    // Jika ada file yang diupload
    if (req.file) {
      // Hapus foto profil lama jika ada
      const user = await Users.findOne({ where: { user_id } });
      if (user.pp_path && user.pp_path !== 'pp_mahasiswa_default.png') {
        const oldFilePath = path.join(uploadDir, user.pp_path);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      
      // Tambahkan path foto baru ke data update
      updateData.pp_path = req.file.filename;
    }
    
    // Update data di database
    const updated = await Users.update(updateData, { where: { user_id } });

    if (updated[0] === 0) {
      return res.status(404).send("User tidak ditemukan.");
    }

    // Redirect dengan menyertakan query parameters
    res.redirect(`profile?user=${user_id}`);
  } catch (error) {
    console.error("Error saat memperbarui status pendaftaran:", error);
    res.status(500).send("Terjadi kesalahan saat memperbarui status.");
  }
});
module.exports = router;
