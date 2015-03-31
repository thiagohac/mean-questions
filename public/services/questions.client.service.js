'use strict';

angular.module('questions').factory('QuestionsService', ['$resource', function($resource) {
    return $resource('/questions/:questionId', {
        questionId: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
        search: {
            method: 'POST',
            url: '/questions/search',
            isArray: true
        },
        addFavorite: {
            method: 'POST',
            url: '/questions/:questionId/favorite'
        },
        removeFavorite: {
            method: 'DELETE',
            url: '/questions/:questionId/favorite'
        },
        vote: {
            method: 'POST',
            url: '/questions/:questionId/vote'
        }
    });
}]);