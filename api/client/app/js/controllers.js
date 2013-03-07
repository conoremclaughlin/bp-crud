'use strict';

/* Controllers */

angular.module('app.controllers', [])

    .controller('BillList', ['$scope', 'Transaction', function($scope, Transaction) {
        console.log('Bill List has been called.');
        Transaction.query(function(bills) {
            console.log('bills: ', bills);
            $scope.bills = bills.data;
        }, function(error) {
            console.error('error retreiving users: ', error);
        });

        $scope.orderProp = 'age';
    }])

    .controller('BillDetails', ['$scope', '$routeParams', 'Transaction', function($scope, $routeParams, Transaction) {
        $scope.submit = function submit() {
            var transDocument = new Transaction(this.bill);
            transDocument.$save(function() {

            }, function(error) {
                alert('Error creating your bill.  Please try again later.');
            });
        };
    }])

    .controller('UserList', ['$scope', 'User', function($scope, User) {
        User.query(function(users) {
            $scope.users = users.data;
        }, function(error) {
            console.error('error retreiving users: ', error);
        });

        $scope.orderProp = 'age';
    }])

    .controller('UserDetails', ['$scope', '$routeParams', '$location', 'User', function($scope, $routeParams, $location, User) {
        // populate the proper user
        User.get({ userId: $routeParams.userId }, function(user) {
            console.log('user: ', user);
            console.log('$scope.user: ', $scope.user);
            $scope.user = user;
        }, function(error) {
            console.error('error retreiving users: ', error);
        });

        $scope.submit = function submit() {
            var userDocument = new User(this.user);
            console.log('userDocument: ', userDocument);
            // TODO: remove new User - may not be needed.
            console.log('userDocument: ', this.user);

            userDocument.$update({ userId: $routeParams.userId }, function() {
                // TODO: alert it's been updated.
                $location.path('/users');
            }, function(error) {
                alert('We cannot update your profile at this time.  Please try again later.');
            });
        };

        $scope.del = function del() {
            User.delete({ userId: $routeParams.userId }, function() {
                console.log('deleted!');
                $location.path('/users');
            }, function() {
                console.error('not deleted!');
            });
        };
    }])

    .controller('UserNew', ['$scope', '$routeParams', '$location', 'User', function($scope, $routeParams, $location, User) {
        $scope.user = {
            username: '',
            email: '',
            firstName: '',
            lastName: ''
        };

        $scope.submit = function submit() {
            var userDocument = new User(this.user);
            userDocument.$save(function(user) {
                // TODO: alert it's been saved.
                $location.path('/users');
            }, function(error) {
                alert('We cannot create your profile at this time.  Our apologies.  Please try again later.');
            });
        };
    }])
;