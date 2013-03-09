'use strict';

/* Services */

angular.module('app.services', ['ngResource'])

    .factory('ModelResource', ['$resource', '$location', '$http', function($resource, $location, $http) {
        // TODO: abstract to .value() and make more flexible? hmm...
        var urlRoot = '';

        function Model() {
            this.initialize.apply(this, arguments);
        }

        Model.extendResource = function(url, resourceUrl, Class) {
            // resourceUrl is optional - bulk queries may need a different api point
            resourceUrl = resourceUrl ? urlRoot + resourceUrl : urlRoot + '/api' + url + '/:id/';
            Class.prototype = Object.create(Model.prototype);
            Class.prototype.url = url;
            Class.prototype.apiUrl = function(id) {
                var url = urlRoot + '/api' + this.url + '/';
                url += (id || this.id) ? (id || this.id) + '/' : '';
                return url;
            };

            // array fix for mongodb records returned form the API
            Class.prototype.Resource = $resource(resourceUrl, {}, {
                query: { method: 'GET', isArray: false }
            });

            Class.prototype.cache = {
                hasData: false,
                get: function() {
                    return this.hasData ? this.data : this.hasData;
                },
                set: function(data) {
                    this.data = data;
                    this.hasData = true;
                }
            };

            for (var prop in Model) {
                if (prop !== 'prototype') Class[prop] = Model[prop];
            }

            /* expose these as static properties */
            Class.cache = Class.prototype.cache;
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

        Model.prototype.create = function create(options) {
            options = options || {};
            var that = this
              , model = options.model || this.model;

            var success = options.success || function() {
                $location.path(that.url);
            };
            var error = options.error || function() {
                alert('We cannot reach the API at this time.  Our apologies.  Please try again later.');
            };

            // let mongo generate the objectId
            if (model.id) delete model.id;

            // TODO: check if API allows calling this.Resource directly
            // TODO: change to this.apiUrl()
            $http.post(urlRoot + '/api' + this.url + '/', model)
                .success(success)
                .error(error);
        };

        Model.prototype.update = function update(id) {
            var that = this;
            id = id || this.model.id;

            $http.put(this.apiUrl(id), this.model)
                .success(function() {
                    $location.path(that.url);
                })
                .error(function(error) {
                    alert('We cannot update your profile at this time.  Please try again later.');
                });
        };

        /**
         * static
         */
        Model.query = function fetch(success, error) {
            var that = this;
            if (this.cache.hasData) {
                return success(this.cache.get());
            } else {
                return this.Resource.query(function(results) {
                    that.cache = results.data;
                    success(results);
                }, error);
            }
        };

        return Model;
    }])

    .factory('UserResource', ['ModelResource', function(Model) {

        var User = Model.extendResource('/users', null, function User() {
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

    .factory('BillResource', ['ModelResource', function(Model) {
        var Bill = Model.extendResource('/bills', '/api/list/bills/', function Bill() {
            Model.apply(this, arguments);
        });

        Bill.prototype.schema = {
            id: '',
            amount: 0,
            payer: '',
            ower: '',
            message: ''
        };

        Bill.prototype.process = function process(users) {
            // bug in angular select directive
            // need to map users to ids manually
            this.model.ower = this.model.ower.id;
            this.model.payer = this.model.payer.id;
            this.model.amount = parseFloat(this.model.amount);
            this.create({
                success: function() {
                    // TODO: clear form and data-bind transactions without reloading the page.
                    $location.path('/');
                }
            });
        };

        return Bill;
    }])
;
