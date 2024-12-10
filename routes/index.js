var express = require('express');
var router = express.Router();
const authRouter = require('./authRouter');
const penyelenggaraRouter = require('./penyelenggaraRouter');
const mahasiswaRouter = require('./mahasiswaRouter');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('./auth/login.hbs', { title: 'Express' });
// });

router.use('/', authRouter);
router.use('/penyelenggara', penyelenggaraRouter);
router.use('/mahasiswa', mahasiswaRouter);

module.exports = router;
