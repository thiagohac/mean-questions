'use strict';

/**
 * Module dependencies.
 */
var usersController = require('../../server/controllers/users.server.controller.js'),
    answersController = require('../../server/controllers/answers.server.controller.js');

module.exports = function(app) {


    // VOTES
    app.route('/questions/:questionId/answer/:answerId/vote')
        .post(usersController.requiresLogin, answersController.vote);


    // ANSWERS
    app.route('/questions/:questionId/answer')
    //  .put(usersController.requiresLogin, questionsController.hasAuthorization, answersController.updateAnswer)
        .post(usersController.requiresLogin, answersController.create);

    app.route('/questions/:questionId/answer/:answerId')
        .delete(usersController.requiresLogin, answersController.hasAuthorization, answersController.delete);

    // Finish by binding the question middleware
    app.param('answerId', answersController.answerByID);
};
