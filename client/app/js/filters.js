'use strict';

/* Filters */

angular.module('app.filters', [])

    .filter('checkmark', function() {
        return function(input) {
            return input ? '\u2713' : '\u2718';
        };
    })
;
