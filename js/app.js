"use strict";
/*
 app.js, main Angular application script
 define your module and controllers here
 */
var commentsURL = 'https://api.parse.com/1/classes/comments';


angular.module('CommentSystem', ['ui.bootstrap'])
    .config(function($httpProvider){
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'VsUoQK1ESGBtA91xmE1knPJOlRugTgfa3uSDwamZ';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'XwOOBEIZD2BY7D0XHQnUnhny6nX5g49oSCkNDKlr';
    })
    .controller('CommentController', function($scope, $http) {
        $scope.refreshComments = function() {
            $http.get(commentsURL)
                .success(function(data) {
                    $scope.comments = data.results;
                });
        };
        $scope.refreshComments();

        $scope.addComment = function() {
            $scope.inserting = true;
            $http.post(commentsURL, $scope.newComment)
                .success(function(responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {};
                })
                .finally( function() {
                    $scope.inserting = false;
                });
        };

        $scope.incrementVotes = function(comment, amount) {
            var postData = {
                votes: {
                    __op: 'Increment',
                    amount: amount
                }
            };

            $scope.updating = true;
            $http.put(commentsURL + '/' + comment.objectId, postData)
                .success(function(respData) {
                    comment.votes = respData.votes;
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.updating = false;
                });
        };

        $scope.deleteComment = function(comment) {
            $http.delete(commentsURL + '/' + comment.objectId, comment).finally(function() {
                $scope.refreshComments();
            });
        };
    });

