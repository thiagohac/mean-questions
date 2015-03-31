'use strict';

/**
 * Module dependencies.
 */
var usersController = require('../../server/controllers/users.server.controller.js'),
    questionsController = require('../../server/controllers/questions.server.controller.js');

module.exports = function(app) {
    // Question Routes

    app.route('/questions')
        .post(usersController.requiresLogin, questionsController.create);

    app.route('/questions/search')
        .post(usersController.requiresLogin, questionsController.search);

    app.route('/questions/:questionId')
        .get(usersController.requiresLogin, questionsController.read)
        .put(usersController.requiresLogin, questionsController.hasAuthorization, questionsController.update)
        .delete(usersController.requiresLogin, questionsController.hasAuthorization, questionsController.delete);


    // FAVORITES
    app.route('/questions/:questionId/favorite')
        .post(usersController.requiresLogin, questionsController.addFavorite)
        .delete(usersController.requiresLogin, questionsController.removeFavorite);

    // VOTES
    app.route('/questions/:questionId/vote')
        .post(usersController.requiresLogin, questionsController.vote);

    app.param('questionId', questionsController.questionByID);
};
