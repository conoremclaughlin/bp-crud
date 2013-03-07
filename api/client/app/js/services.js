'use strict';

/* Services */

angular.module('app.services', ['ngResource'])

    .factory('User', function($resource) {
        return $resource('api/users/:userId/', {}, {
            query: { method: 'GET', isArray: false },
            update: { method: 'PUT' }
        });
    })

    .factory('Transactions', function($resource) {
        return $resource('api/transactions/:transactionId/', {}, {
            query: { method: 'GET', isArray: false },
            update: { method: 'PUT' }
        });
    })
;
