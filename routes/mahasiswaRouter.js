// Router Mahasiswa dan Panitia
var express = require('express');
var router = express.Router();

router.get('/home', function(req, res, next) {
    res.render('./home_mhs.hbs', { title: 'Dashboard', layout: "layouts/main"});
});

router.get('/pengumuman', function(req, res, next) {
    res.render('./pengumuman_mhs.hbs', { title: 'Pengumuman', layout: "layouts/main"});
});

router.get('/daftar', function(req, res, next) {
    res.render('./daftar_mhs.hbs', { title: 'Pendaftaran', layout: "layouts/main"});
});

module.exports = router;