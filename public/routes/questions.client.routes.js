'use strict';

angular.module('questions').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/");

        $stateProvider.
            state('listQuestions', {
                url: '/questions',
                templateUrl: 'views/list-all-question.client.view.html'
            }).
            state('listUnansweredQuestions', {
                url: '/questions/unanswered',
                templateUrl: 'views/list-unanswered-question.client.view.html'
            }).
            state('listFavoriteQuestions', {
                url: '/questions/favorite',
                templateUrl: 'views/list-favorite-question.client.view.html'
            }).
            state('listUserQuestions', {
                url: '/questions/byUser',
                templateUrl: 'views/list-user-question.client.view.html'
            }).
            state('createQuestion', {
                url: '/questions/create',
                templateUrl: 'views/create-question.client.view.html'

            }).
            state('viewQuestion', {
                url: '/questions/:questionId',
                templateUrl: 'views/view-question.client.view.html'
            }).
            state('editQuestion', {
                url: '/questions/:questionId/edit',
                templateUrl: 'views/edit-question.client.view.html'
            });
    }
]);