var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require ('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyparser = require ('body-parser');
var session = require ('express-session');
var passport = require ('passport');
var expressvalidator = require ('express-validator');
var localstrategy = require ('passport-local');
var flash = require ('connect-flash');
var mongo = require ('mongodb');
var mongoose = require ('mongoose');
var db = mongoose.connection;

var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
 
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//handle session
app.use(session({secret:'secret', saveuninitialized: true, resave: true}))
app.use('/', indexRouter);
app.use('/users', usersRouter);

//passport
app.use(passport.initialize());
app.use(passport.session());

//validator
app.use(expressvalidator({
	errorformatter; function(param, msg, value) {
		var namespace = param.split('.')
		, root = namespace.shift()
		, formparm = root;
		while(namespace.length) {
			formparm += '[' + namespace.shift() + ']';
		}
		return{
			param : formparm,
			msg : msg,
			value : value
		};
	}
}));

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
