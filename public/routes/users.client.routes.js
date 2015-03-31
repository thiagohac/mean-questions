'use strict';

angular.module('users').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");

        $stateProvider.
            state('signup', {
                url: '/users/signup',
                templateUrl: 'views/signup.client.view.html'

            }).
            state('signin', {
                url: '/users/signin',
                templateUrl: 'views/signin.client.view.html'
            });

    }
]);