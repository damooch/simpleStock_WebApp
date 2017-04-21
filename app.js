var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jade = require('jade');
var Highcharts = require('highcharts');

var User = require('./models/user');

// added ***************************
var app = express();
var session = require('express-session');
var jwt = require('jsonwebtoken');
var $ = require('jQuery')


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/project4');
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("You're connected to the project 4 db");
});

// Load module after Highcharts is loaded
//require('highcharts/modules/exporting')(Highcharts); 


var index = require('./routes/index');
var users = require('./routes/users');
var stock = require('./routes/stock');

//var app = express();

// session to store token
app.use(session({
  secret: 'group4',
  resave: false,
  saveUninitialized: false
}));

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/stock', stock);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  //console.log(req.body);
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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