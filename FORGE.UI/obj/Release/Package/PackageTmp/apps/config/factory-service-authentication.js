(function () {
    'use strict';

    var service = function ($http, APIEndpoint) {
        return {
            _get: function (t) {
                return $http({
                    method: 'GET',
                    url: APIEndpoint,
                    headers: {
                        'Authorization': t,
                    }
                });
            } //auth fn
        }//return
    };

    var controller = function ($http, APIEndpoint, $cookies, $rootScope) {
        var _token = '';
        return {
            authentication: function (user) {
                return new service($http, APIEndpoint.auth)._get('Basic ' + user)
                .then(function (resp) {
                    _token = resp.headers('authentication-info');
                    return new service($http, resp.data.data._links[0].href)._get(_token)
                                     .then(function (data) {
                                         return new service($http, data.data.data._links[0].href)._get(_token)
            .then(function (data) {
                /* -assign token- */
                if (typeof $cookies.get('profile') !== const_auth.undefined)
                    $cookies.remove('profile');

                if (typeof sessionStorage._contentManagement !== const_auth.undefined)
                    sessionStorage.removeItem('_contentManagement');
                sessionStorage.setItem('_contentManagement', JSON.stringify(data.data.data));

                resp._token = _token;
                $cookies.put('profile', JSON.stringify(resp));
                $rootScope.profile = JSON.stringify($cookies.get('profile'));
                /* end token */
                return { status: true, toState: sessionStorage._toState };
            }).catch(function (resp) {
                return { status: false, statusText: resp.config.url + ' ' + resp.statusText };
            });
                                     }).catch(function (resp) {
                                         return { status: false, statusText: resp.config.url + ' ' + resp.statusText };
                                     });
                }).catch(function (resp) {
                    return { status: false, statusText: resp.data.error.userMessage };
                });

            },
            contentManagement: function (i) {
                var _link = JSON.parse(sessionStorage._contentManagement).items[i]._links[0].href;
                _token = JSON.parse($cookies.get('profile'))._token;
                return new service($http, _link)._get(_token)
                    //.then(function (data) {
                    //return data;
                    //})
                ;
            },
            sayHello: function () {
                /* test method */
                return alert('hello world');
            },
        }
    };

    controller.$inject = ['$http', 'APIEndpoint', '$cookies', '$rootScope']


    angular
        .module('app_serviceEndpoint', [])
        .factory('serviceEndpoint', controller)
    ;//factory



})();