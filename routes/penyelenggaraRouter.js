// Router Penyelenggara
var express = require('express');
var router = express.Router();

router.get('/home', function(req, res, next) {
    res.render('./home_admin.hbs', { title: 'Dashboard', layout: "layouts/main_admin"});
});

router.get('/informasi_kegiatan', function(req, res, next) {
    res.render('./informasi_admin.hbs', { title: 'Informasi Kegiatan', layout: "layouts/main_admin"});
});

router.get('/kelola_pendaftaran', function(req, res, next) {
    res.render('./kelola_pendaftaran_admin.hbs', { title: 'Kelola Pendaftaran', layout: "layouts/main_admin"});
});

router.get('/kelola_pendaftaran/pendaftar', function(req, res, next) {
    res.render('./pendaftar_admin.hbs', { title: 'Kelola Pendaftaran', layout: "layouts/main_admin"});
});

module.exports = router;