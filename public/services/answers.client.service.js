'use strict';

angular.module('questions').factory('AnswersService', ['$resource', function($resource) {
    return $resource('/questions/:questionId/answer/:answerId', {
        answerId: '@_id',
        questionId: '@_questionId'
    }, {
        update: {
            method: 'PUT'
        },
        vote: {
            method: 'POST',
            url: '/questions/:questionId/answer/:answerId/vote'
        }
    });
}]);