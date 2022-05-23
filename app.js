require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Database connection and models
var sequelize = require('./db/connections');
const Admin = require('./models/admins');
// import all models
require('./models/all');

Admin.findAll()
.then(admins => {
  if (admins.length === 0) {
    Admin.create({
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
      firstName: 'Admin',
      lastName: 'Admin',
      email: process.env.ADMIN_EMAIL,
      is_superuser: true,
    })
    .then(admin => {
      console.log('Admin created: ', admin);
    })
    .catch(err => {
      console.log('Error creating admin: ', err);
    });

  }
  else {
    console.log('Admin already exists: ', admins);
  }
})
.catch(err => {
  console.log('Error finding admin: ', err);
});


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', usersRouter);

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

module.exports = app;
