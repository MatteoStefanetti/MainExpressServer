var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var clubsRouter = require('./routes/clubs.js')
var indexRouter = require('./routes/index');
var singlePageRouter = require('./routes/single_page.js')

var app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerAutogen = require('swagger-autogen')();
const swaggerFile = require('./swagger/swagger-output.json')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/clubs', clubsRouter);
app.use('/single_page', singlePageRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = app;
