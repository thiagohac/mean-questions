'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    AnswerModel = mongoose.model('Answer'),
    _ = require('lodash');

var getErrorMessage = function(err) {
    var message = '';

    if (err.code) {
        message = 'Erro indefinido';
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    }

    return message;
};

exports.create = function(req, res) {
    var answer = new AnswerModel();
    var question = req.question;
    answer.user = req.user;
    answer.content = req.body.content;

    answer.save(function(err) {

        if( err ) {
            return res.send(500, {
                message: getErrorMessage(err)
            });
        } else {

            question.answers.push(answer);
            if (question.answers.length > 1) {
                question.answers = _.sortByOrder(question.answers, ['totalVotes'], [false]);
            }

            question.save(function(err) {
                if( err ) {
                    return res.send(500, {
                        message: getErrorMessage(err)
                    });
                } else {
                    res.jsonp(answer);
                }
            });
        }
    });
};



exports.delete = function(req, res) {
    var question = req.question;
    var answer = req.answer;

    question.answers.id(answer._id).remove();

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

exports.answerByID = function(req, res, next, id) {
    AnswerModel.findById(id).populate('user').exec(function(err, answer) {
        if (err) return next(err);
        if (!answer) return next(new Error('Erro ao carregar resposta ' + id));
        req.answer = answer;
        next();
    });
};

exports.hasAuthorization = function(req, res, next) {
    if (req.answer.user.id !== req.user.id) {
        return res.send(403, {
            message: 'Usuário não autorizado'
        });
    }
    next();
};


exports.vote = function(req, res) {
    var answer = req.answer;
    var question = req.question;

    var user = req.user;


    answer = question.answers.id(answer._id);

    if (req.body.paramUpDown) {
        answer.upVotes.push(user);
    } else {
        answer.downVotes.push(user);
    }

    answer.totalVotes = answer.upVotes.length - answer.downVotes.length;

    if (question.answers.length > 1) {
        question.answers = _.sortByOrder(question.answers, ['totalVotes'], [false]);
    }

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