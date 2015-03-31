'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	Question = mongoose.model('Question');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Usuário já existe';
				break;
			default:
				message = 'Erro indefinido';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * Signup
 */
exports.signup = function(req, res) {
	// Init Variables
	var user = new User(req.body);
    user.displayName = user.firstName + ' ' + user.lastName;

	// Then save the user
	user.save(function(err) {
		if (err) {
			return res.send(500, {
				message: getErrorMessage(err)
			});
		} else {
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function(err) {
				if (err) {
					res.send(500, err);
				} else {
					res.jsonp(user);
				}
			});
		}
	});
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			res.send(500, info);
		} else {
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function(err) {
				if (err) {
					res.send(500, err);
				} else {
					res.jsonp(user);
				}
			});
		}
	})(req, res, next);
};


exports.userByID = function(req, res, next, id) {
    User.findOne({
        _id: id
    }).populate('questions favorites')
    .exec(function(err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Erro ao carregar usuário ' + id));

        req.user = user;

        next();
    });
};

exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.send(401, {
            message: 'Usuário não logado'
        });
    }

    next();
};


exports.get = function(req, res) {
    res.jsonp(req.user);
};