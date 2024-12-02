var express = require('express');
var router = express.Router();
const authRouter = require('./authRouter');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('./auth/login.hbs', { title: 'Express' });
// });

router.use('/', authRouter);

module.exports = router;
