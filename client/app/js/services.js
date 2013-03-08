'use strict';

/* Services */

angular.module('app.services', ['ngResource'])

    .factory('ModelResource', ['$resource', '$location', '$http', function($resource, $location, $http) {
        // TODO: abstract to .value() and make more flexible? hmm...
        var urlRoot = '';

        function Model() {
            this.initialize.apply(this, arguments);
        }

        Model.extendResource = function(url, Class) {
            var idUrl = urlRoot + '/api' + url + '/:id/';
            Class.prototype = Object.create(Model.prototype);
            Class.prototype.url = url;
            Class.prototype.apiUrl = function(id) {
                var url = urlRoot + '/api' + this.url + '/';
                url += (id || this.id) ? (id || this.id) + '/' : '';
                return url;
            };

            // array fix for mongodb records returned form the API
            Class.prototype.Resource = $resource(idUrl, {}, {
                query: { method: 'GET', isArray: false }
            });

            Class.Resource = Class.prototype.Resource;

            return Class;
        };

        Model.prototype.schema = {};

        Model.prototype.initialize = function initialize(options, bootstrap) {
            options = options || {};

            // cloning the schema into the model - @see http://jsperf.com/cloning-an-object/2
            // this behavior may be unwanted depending on space complexity and use cases
            this.model = JSON.parse(JSON.stringify(this.schema));
            this.url = this.url || options.url || '/';
            this.path = options.path || '';

            if (options.model) {
                // note: this filter does not do a deep recursion checking of the schema.
                for (var prop in options.model) {
                    if (this.schema.hasOwnProperty(prop)) this.model[prop] = options.model[prop];
                }
            }

            return this;
        };

        Model.prototype.del = function del(id) {
            var that = this;
            id = id || this.model.id;

            this.Resource.remove({ id: id }, function() {
                $location.path(that.url);
            }, function() {
                alert('We cannot reach the API at this time.  Our apologies.  Please try again later.');
            });
        };

        Model.prototype.create = function create(model) {
            var that = this;
            model = model || this.model;

            // TODO: check if API allows calling this.Resource directly
            $http.post(urlRoot + '/api' + this.url + '/', model)
                .success(function() {
                    $location.path(that.url);
                })
                .error(function() {
                    alert('We cannot reach the API at this time.  Our apologies.  Please try again later.');
                });
        };

        Model.prototype.update = function update(id) {
            var that = this;
            id = id || this.model.id;

            $http.put(this.apiUrl(id), this.model, function() {
                $location.path(that.url);
            }, function(error) {
                alert('We cannot update your profile at this time.  Please try again later.');
            });
        };

        return Model;
    }])

    .factory('UserResource', ['ModelResource', function(Model) {

        var User = Model.extendResource('/users', function User() {
            Model.apply(this, arguments);
        });

        User.prototype.schema = {
            username: '',
            email: '',
            firstName: '',
            lastName: ''
        };

        return User;
    }])
;
