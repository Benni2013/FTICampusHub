// Router Penyelenggara
var express = require('express');
var router = express.Router();

router.get('/ProfileAdm', function(req, res, next) {
    res.render('./Profile.hbs', { title: 'Profile', layout: "layouts/main_admin"});
});

module.exports = router;