// Router Mahasiswa dan Panitia
var express = require('express');
var router = express.Router();
const Users = require('../models/Users');

router.get('/home', async (req, res, next) => {
    try {
        let user_id = req.query.user;
        let user = await Users.findOne({ where: { user_id } });
        console.log(user);
        res.render('./home_mhs.hbs', { title: 'Dashboard Mahasiswa', layout: "layouts/main", user});
    } catch (error) {
        
    }
    
});

router.get('/pengumuman', function(req, res, next) {
    res.render('./pengumuman_mhs.hbs', { title: 'Pengumuman', layout: "layouts/main"});
});

router.get('/daftar', function(req, res, next) {
    res.render('./daftar_mhs.hbs', { title: 'Pendaftaran', layout: "layouts/main"});
});

module.exports = router;