'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    QuestionModel = mongoose.model('Question'),
    _ = require('lodash');
/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
    var message = '';

    if (err.code) {
        message = 'Erro indefinido';
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
            }
        }
    }

    return message;
};


exports.create = function(req, res) {
    var question = new QuestionModel(req.body);
    question.user = req.user;

    question.save(function(err) {
        if (err) {
            return res.send(500, {
                message: getErrorMessage(err)
            });
        } else {
            var user = req.user;
            user.questions.push(question);
            user.save(function(err) {
                if (err) {
                    return res.send(500, {
                        message: getErrorMessage(err)
                    });
                }
                res.jsonp(question);
            });
        }
    });
};

exports.search = function(req, res) {
    QuestionModel
        .find(req.body.filter)
        .sort('-created')
        .populate('user answers')
        .exec(function(err, questions) {
        if (err) {
            return res.send(500, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(questions);
        }
    });
};

exports.update = function(req, res) {
    var question = req.question;

    question = _.extend(question, req.body);

    question.save(function(err) {
        if (err) {
            return res.send(500, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(question);
        }
    });
};

exports.delete = function(req, res) {
    var question = req.question;

    question.remove(function(err) {
        if (err) {
            return res.send(500, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(question);
        }
    });
};

exports.addFavorite = function(req, res) {
    // req.question foi colocado pelo questionByID
    // req.body é o parâmetro do método
    var question = req.question;

    var user = req.user;
    question.favoriteBy.push(user);
    _.uniq(question.favoriteBy, false);

    question.save(function(err) {

        if (err) {
            return res.send(500, {
                message: getErrorMessage(err)
            });
        }
        user.favorites.push(question);
        _.uniq(user.favorites, false);
        user.save(function(err) {
            if( err ) {
                return res.send(500, {
                    message: getErrorMessage(err)
                });
            }
            res.jsonp(question);
        });
    });

};

exports.removeFavorite = function(req, res) {
    // questionByID colocou no req.question
    var question = req.question;

    var user = req.user;

    var index2 = question.favoriteBy.indexOf(user._id);
    question.favoriteBy.splice(index2, 1);

    question.save(function(err) {

        if( err ) {
            return res.send(500, {
                message: getErrorMessage(err)
            });
        }
        var index = user.favorites.indexOf(question._id);
        user.favorites.splice(index, 1);
        user.save(function(err) {
            if( err ) {
                return res.send(500, {
                    message: getErrorMessage(err)
                });
            }
            res.jsonp(question);
        });
    });
};



exports.questionByID = function(req, res, next, id) {
    QuestionModel.findById(id).populate('user answers answers.user').exec(function(err, question) {
        if (err) return next(err);
        if (!question) return next(new Error('Erro ao carregar questão ' + id));
        req.question = question;
        next();
    });
};


exports.hasAuthorization = function(req, res, next) {
    if (req.question.user.id !== req.user.id) {
        return res.send(403, {
            message: 'Usuário não autorizado'
        });
    }
    next();
};




exports.vote = function(req, res) {
    // req.question foi colocado pelo articleByID
    // req.body é o parâmetro do método
    var question = req.question;

    var user = req.user;
    if (req.body.paramUpDown) {
        question.upVotes.push(user);
    } else {
        question.downVotes.push(user);
    }

    question.totalVotes = question.upVotes.length - question.downVotes.length;

    question.save(function(err) {

        if (err) {
            return res.send(500, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(question);
        }
    });
};

exports.read = function(req, res) {
    res.jsonp(req.question);
};



