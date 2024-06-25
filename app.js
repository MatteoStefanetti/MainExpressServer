var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var competitionsRouter = require('./routes/competitions.js')
var clubsRouter = require('./routes/clubs.js')
var indexRouter = require('./routes/index');
var singlePageRouter = require('./routes/single_page.js')
var homeRouter = require('./routes/home.js')
var playersRouter = require('./routes/players.js')
var singlePageGameRouter = require('./routes/single_page_game.js')
var singlePageCompetitionRouter = require('./routes/single_page_competition.js')
var singlePageClubRouter = require('./routes/single_page_club.js')
var singlePagePlayerRouter = require('./routes/single_page_player.js')

var app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerAutogen = require('swagger-autogen')();
const swaggerFile = require('./swagger/swagger-output.json')

console.log("MainExpressServer started")

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/home', homeRouter);
app.use('/competitions', competitionsRouter);
app.use('/clubs', clubsRouter);
app.use('/players', playersRouter);
app.use('/single_page', singlePageRouter);
app.use('/single_page/game', singlePageGameRouter);
app.use('/single_page/competition', singlePageCompetitionRouter);
app.use('/single_page/club', singlePageClubRouter);
app.use('/single_page/player', singlePagePlayerRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = app;
