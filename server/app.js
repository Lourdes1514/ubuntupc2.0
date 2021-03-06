var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var passport = require('passport')
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('./config/passport')(passport)

/* 
  Method Override:
  Lets you use HTTP verbs such
  as PUT or DELETE in places 
  where the client doesn't support it.
*/
var methodOverride = require('express-method-override');
/*  ------------------------------------  */

var config = require('./config/config');
var connection = require('./config/connect');
/*
	API
*/
var api = require('./routes/api');
/*  ------------------------------------  */

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize())
app.use(passport.session())
/*
	------ Usage Method Override ---------
*/
app.use(methodOverride("_method"));
/*  ------------------------------------  */

app.use(express.static(path.join(__dirname, '../client/public')));

// GET Templates
app.get('/home', api.getIndex);
app.get('/', api.getLogin);
app.get('/users', api.getUsers);
app.get('/user/:id', api.getUserDetails);
app.get('/edit/:id', api.getEditUser);
app.get('/json', api.getJson);
// ---  ---
app.get('/create', api.getCreateUser);
app.post('/create', api.postCreateUser);
app.put('/edit/:id', api.putEditUser);
app.delete('/delete/:id', api.deleteUser);

// Facebook
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook',
  { successRedirect: '/home', failureRedirect: '/' }
));
// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
