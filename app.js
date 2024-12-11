var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

// Inisialisasi Express
var app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const authRoutes = require('./routes/authRoutes');
const pendaftaranRoutes = require('./routes/pendaftaranRoutes');
const kegiatanRoutes = require('./routes/kegiatanRoutes');
const pengumumanRoutes = require('./routes/pengumumanRoutes');
const riwayatRoutes = require('./routes/riwayatRoutes');
const sertifikatRoutes = require('./routes/sertifikatRoutes');
const profileRoutes = require('./routes/profileRoutes');

// Middleware untuk parsing JSON
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Routing
app.use('/auth', authRoutes);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/pendaftaran', pendaftaranRoutes);
app.use('/kegiatan', kegiatanRoutes);
app.use('/pengumuman', pengumumanRoutes);
app.use('/riwayat', riwayatRoutes);
app.use('/sertifikat', sertifikatRoutes);
app.use('/profile', profileRoutes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// // Jalankan server
// app.listen(process.env.PORT || 3000, () => {
//   console.log(`Server running on port ${process.env.PORT || 3000}`);
// });

module.exports = app;
