var express = require('express');
var router = express.Router();
const authRoutes = require('./authRoutes');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('./auth/login.hbs', { title: 'Express' });
// });

router.use('/', authRoutes);

module.exports = router;
