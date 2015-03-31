'use strict';

angular.module('questions').controller('QuestionsController', ['$scope', '$stateParams', '$location',
    'Authentication', 'QuestionsService', 'AnswersService', 'UsersService',

    function($scope, $stateParams, $location, Authentication, QuestionsService, AnswersService, UsersService) {
		$scope.authentication = Authentication;

        if (!$scope.authentication.user) $location.path('/');

		$scope.create = function() {
			var question = new QuestionsService({
				title: $scope.title,
				content: $scope.content
			});

            question.$save(function(response) {
				$location.path('questions/' + response._id);
			}, function(error) {
				$scope.error = error.data.message;
			});

            $scope.title = '';
            $scope.content = '';
		};

        $scope.remove = function() {
            $scope.question.$remove(function() {
                window.history.back();
            }, function(error) {
                $scope.error = error.data.message;
            });
        };

        $scope.update = function() {
            var question = $scope.question;

            question.$update(function() {
                $location.path('questions/' + question._id);
            }, function(error) {
                $scope.error = error.data.message;
            });
        };

        $scope.vote = function (paramUpDown) {
            var question = new QuestionsService({
                _id: $stateParams.questionId,
                paramUpDown: paramUpDown
            });

            question.$vote(function(question) {
                $scope.question = question;
            }, function(error) {
                $scope.error = error.data.message;
            });
        };

        $scope.isVoted = function(entity) {
            if (!entity || !entity.upVotes || !entity.downVotes) {
                return false;
            }

            var index = window._.find(entity.upVotes, function(u){
                return u === $scope.authentication.user._id;
            });
            var index2 = window._.find(entity.downVotes, function(u){
                return u === $scope.authentication.user._id;
            });

            // se achou algum index será true (votado)
            // se não achou nenhum será false (não votado)
            return index || index2;

        };

        $scope.addFavorite = function() {
            var question = new QuestionsService({
                _id: $stateParams.questionId
            });

            question.$addFavorite(function (question) {
                $scope.question = question;
                UsersService.get({userId: $scope.authentication.user._id}, function (user) {
                    $scope.authentication.user = user;
                });
            }, function (error) {
                $scope.error = error.data.message;
            });

        };

        $scope.removeFavorite = function() {
            var question = new QuestionsService({
                _id: $stateParams.questionId
            });

            question.$removeFavorite(function(question) {
                $scope.question = question;
                UsersService.get({userId: $scope.authentication.user._id}, function(user) {
                    $scope.authentication.user = user;
                });
            }, function(error) {
                $scope.error = error.data.message;
            });

        };



        $scope.isFavorited = function() {
            var favorites = $scope.authentication.user.favorites;

            return _.findIndex(favorites, { '_id': $stateParams.questionId }) !== -1;
        };



		$scope.findAll = function() {
			QuestionsService.search({}
            , function(questions) {
                $scope.title = "Listagem de todas as questões";
                $scope.questions = questions;
            }, function(error) {
                $scope.error = error.data.message;
            });
		};

		$scope.findUnanswered = function() {
             QuestionsService.search({filter: {'answers.0': {$exists: false}}
            }, function(questions) {
                $scope.title = "Listagem de questões não respondidas";
                $scope.questions = questions;
            }, function(error) {
                $scope.error = error.data.message;
            });
		};

		$scope.findFavoriteQuestions = function() {
            QuestionsService.search({filter: {'favoriteBy': $scope.authentication.user._id}
            }, function(questions) {
                $scope.title = "Listagem de questões favoritas";
                $scope.questions = questions;
            }, function(error) {
                $scope.error = error.data.message;
            });
		};

		$scope.findUserQuestions = function() {
            UsersService.get({userId: $scope.authentication.user._id}, function (user) {
                var questions = user.questions

                questions.forEach(function(question) {
                   question.user = user;
                });

                $scope.title = "Listagem criadas pelo usuário";
                $scope.questions = questions;
                $scope.authentication.user = user;
            }, function(error) {
                $scope.error = error.data.message;
            });
		};



		$scope.findOne = function() {
			QuestionsService.get({
				questionId: $stateParams.questionId
			}, function(question) {
                $scope.question = question;
            }, function(error) {
                $scope.error = error.data.message;
            });
		};




        // ANSWER

        $scope.createAnswer = function() {
            var service = new AnswersService({
                _questionId : $scope.question._id,
                content: this.content
            });


            service.$save(function(answer) {
               answer.user = $scope.authentication.user;
               $scope.question.answers.push(answer);

            }, function(error) {
                $scope.error = error.data.message;
            });


            this.content = '';
        };


        $scope.removeAnswer = function(answer) {

            var service = new AnswersService({
                _id: answer._id,
                _questionId : $stateParams.questionId
            });

            service.$remove(function(question) {
                $scope.question = question;
            }, function(error) {
                $scope.error = error.data.message;
            });

        };



        $scope.voteAnswer = function (answer, paramUpDown) {

            var service = new AnswersService({
                _id: answer._id,
                _questionId : $stateParams.questionId,
                paramUpDown: paramUpDown
            });

            service.$vote(function(question) {
                $scope.question = question;
            }, function(error) {
                $scope.error = error.data.message;
            });

        };

	}

]);

