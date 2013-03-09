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

    .controller('BillList', ['$scope', 'UserResource', 'BillResource', function($scope, User, Bill) {
        // User list is the main page, so lets access cache of all available users.
        // TODO: create a getUsers method or wrap query to use a cache
        User.query(function(users) {
            $scope.users = users.data;
        }, function(error) {
            console.error('error retreiving users: ', error);
        });

        Bill.query(function(bills) {
            $scope.bills = bills.data;
        }, function(error) {
            console.error('error retreiving bills: ', error);
        });

        $scope.bill = new Bill();
        $scope.showNewBill = false;
        $scope.toggleBillForm = function toggleBillForm(event) {
            console.log('toggling the bill form');
            $scope.showNewBill = !$scope.showNewBill;
            $('.btn-add').toggleClass('disabled');
        };
    }])
;