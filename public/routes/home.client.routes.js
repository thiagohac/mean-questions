'use strict';

angular.module('home').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");

        $stateProvider.
        state('index', {
            url: '/',
            templateUrl: 'views/index.client.view.html'

        });

    }
]);