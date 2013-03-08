'use strict';

/* App Module */
angular.module('bp-crud', ['app.filters', 'app.services', 'app.filters', 'app.controllers'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/users', { templateUrl: 'partials/user-list.html', controller: 'UserList' })
            .when('/users/new', { templateUrl: 'partials/user-add.html', controller: 'UserNew' })
            .when('/users/:id', { templateUrl: 'partials/user-details.html', controller: 'UserDetails' })
            .otherwise({ redirectTo: '/users' });
    }])
;
