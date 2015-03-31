'use strict';

// Define the main angular application module name
var mainApplicationModuleName = 'home';

var dependencies = ['ngResource', 'ui.router', 'ui.bootstrap'];


// Define the main angular application module 
var mainApplicationModule = angular.module(mainApplicationModuleName, dependencies);

//Configure application hashbang routing
mainApplicationModule.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);


var questions = 'questions';
angular.module(questions, dependencies);
angular.module(mainApplicationModuleName).requires.push(questions);

var users = 'users';
angular.module(users, dependencies);
angular.module(mainApplicationModuleName).requires.push(users);



angular.element(document).ready(function() {

   // Init the AngularJS application
   angular.bootstrap(document, [mainApplicationModuleName]);
});