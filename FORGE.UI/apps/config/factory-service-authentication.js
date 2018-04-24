(function () {
    'use strict';

    var controller = function ($http, APIEndpoint, $cookies, $rootScope, apiService) {
        var _token = '';
        return {
            authentication: function (user) {
                return new apiService._get($http, APIEndpoint.auth,
                    {
                        'Authorization': 'Basic ' + user,
                    })
                .then(function (resp) {
                    _token = resp.headers('authentication-info');
                    return new apiService._get($http, resp.data.data._links[0].href,
                         {
                             'Authorization': _token,
                         })
                                     .then(function (data) {
                                         sessionStorage.setItem("baseApplicationUrl", JSON.stringify(data.data.data._links[0].href));
                                         return new apiService._get($http, data.data.data._links[0].href,
                                             {
                                                 'Authorization': _token,
                                             })
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
                    if (resp.data.error.userMessage != undefined) {
                        return { status: false, statusText: resp.data.error.userMessage };
                    }
                    else {
                        return { status: false, statusText: "An unexpected error occurred. Please try again. If this problem persists, please contact your program administrator." }
                    }
                });

            },
            contentManagement: function (i) {
                var _link = JSON.parse(sessionStorage._contentManagement).items[i]._links[0].href;
                _token = JSON.parse($cookies.get('profile'))._token;
                return new apiService._get($http, _link,
                    {
                        'Authorization': _token,
                    });
            },
            sayHello: function () {
                /* test method */
                return alert('hello world');
            },
        }
    };

    controller.$inject = ['$http', 'APIEndpoint', '$cookies', '$rootScope', 'apiService']


    angular
        .module('app_serviceEndpoint', [])
        .factory('serviceEndpoint', controller)
    ;//factory



})();