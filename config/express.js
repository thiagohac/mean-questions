var express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    path = require('path'),
    passport = require('passport');

module.exports = function() {
    // Init express application
    var app = express();

    // Configure models
    require('../server/models/user.server.model');
    require('../server/models/answer.server.model');
    require('../server/models/question.server.model');


	// Enable logger (morgan)

    // Use Express middlewares
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());

    app.use(session({secret: 'MEAN',
        saveUninitialized: true,
        resave: true}));

    // Set view engine
    app.set('views', __dirname + '/../server/views');
    app.set('view engine', 'ejs');

    // Connect flash for flash messages

    // Init Passport 
    app.use(passport.initialize());
    app.use(passport.session());

    // Configure routing
    require('../server/routes/home.server.routes.js')(app);
    require('../server/routes/users.server.routes')(app);
    require('../server/routes/questions.server.routes')(app);
    require('../server/routes/answers.server.routes')(app);

	// Setting the app router and static folder
	app.use(express.static(path.resolve('./public')));

    return app;
};