'use strict';

/* Controllers */

angular.module('app.controllers', [])

    .controller('UserList', ['$scope', 'UserResource', function($scope, User) {
        User.Resource.query(function(users) {
            $scope.users = users.data;
        }, function(error) {
            console.error('error retreiving users: ', error);
        });
    }])

    .controller('UserDetails', ['$scope', '$routeParams', '$location', 'UserResource', function($scope, $routeParams, $location, User) {
        // populate the proper user
        User.Resource.get({ id: $routeParams.id }, function(user) {
            $scope.user = new User({ model: user });
            $scope.id = $routeParams.id;
        }, function(error) {
            console.error('error retreiving user: ', error);
        });
    }])

    .controller('UserNew', ['$scope', '$routeParams', '$location', 'UserResource', function($scope, $routeParams, $location, User) {
        $scope.user = new User({});
    }])
;