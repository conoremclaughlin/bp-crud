'use strict';

/* App Module */
angular.module('bp-crud', ['app.filters', 'app.services', 'app.filters', 'app.controllers'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/bills', { templateUrl: 'partials/bill-list.html', controller: 'BillList' })
            .when('/bills/new', { templateUrl: 'partials/bill-details.html', controller: 'BillDetails' })
            .when('/bills/:billId', { templateUrl: 'partials/bill-details.html', controller: 'BillDetails' })
            .when('/users', { templateUrl: 'partials/user-list.html', controller: 'UserList' })
            .when('/users/new', { templateUrl: 'partials/user-add.html', controller: 'UserNew' })
            .when('/users/:userId', { templateUrl: 'partials/user-details.html', controller: 'UserDetails' })
            .otherwise({ redirectTo: '/users' });
    }])
;
