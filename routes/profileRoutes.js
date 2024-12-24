// Router Penyelenggara
var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { Penyelenggara } = require('../models/RelasiTabel')

// Buat direktori jika belum ada
const uploadDir = './public/pp_penyelenggara';
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
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
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

router.get('/ProfileAdm', async (req, res, next) => {
    
    try {
        let penyelenggara_id = req.query.penyelenggara;
        console.log(penyelenggara_id);

        let penyelenggara = await Penyelenggara.findOne({ where: { penyelenggara_id } });

        console.log(penyelenggara);

        res.render('./profile_admin.hbs', { 
            title: 'Profile', 
            layout: "layouts/main_admin",
            data: { penyelenggara }
        });
    } catch (error) {
        console.error(error);
      res.status(500).json({ error: 'Server error occurred' }, error);
    }
});

// Route untuk menampilkan halaman edit profile
router.get('/edit-profile-admin', async (req, res) => {
    try {
        const penyelenggara_id = req.query.penyelenggara;
        const penyelenggara = await Penyelenggara.findOne({ where: { penyelenggara_id } });
        
        res.render('./edit_profile_admin.hbs', { 
            title: 'Edit Profile', 
            layout: "layouts/main_admin",
            data: { penyelenggara }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error occurred' });
    }
});

// Route untuk update profile
router.post('/update-profile-admin', upload.single('logo'), async (req, res) => {
    try {
        const {
            penyelenggara_id,
            nama_penyelenggara,
            email,
            no_telp,
            deskripsi,
            old_password,
            new_password,
            confirm_password
        } = req.body;

        // Ambil data penyelenggara
        const penyelenggara = await Penyelenggara.findOne({ where: { penyelenggara_id } });
        
        // Verifikasi password lama
        const isPasswordValid = await bcrypt.compare(old_password, penyelenggara.password);
        if (!isPasswordValid) {
            return res.render('edit_profile_admin', {
                title: 'Edit Profile',
                layout: "layouts/main_admin",
                data: { penyelenggara },
                error: 'Password lama tidak sesuai'
            });
        }

        // Persiapkan data update
        const updateData = {
            nama_penyelenggara,
            email,
            no_telp,
            deskripsi
        };

        // Jika ada file logo baru
        if (req.file) {
            updateData.logo_path = req.file.filename;
        }

        // Jika ada password baru
        if (new_password) {
            if (new_password !== confirm_password) {
                return res.render('edit_profile_admin', {
                    title: 'Edit Profile',
                    layout: "layouts/main_admin",
                    data: { penyelenggara },
                    error: 'Password baru dan konfirmasi tidak cocok'
                });
            }
            updateData.password = await bcrypt.hash(new_password, 10);
        }

        // Update data
        await Penyelenggara.update(updateData, {
            where: { penyelenggara_id }
        });

        res.redirect(`/ProfileAdm?penyelenggara=${penyelenggara_id}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error occurred' });
    }
});

module.exports = router;