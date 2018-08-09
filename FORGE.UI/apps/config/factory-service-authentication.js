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
                .then(function (loginResponse) {
                    _token = loginResponse.headers('authentication-info');
                    // get the logged user Object
                    var userObject = loginResponse.data.data;
                    var userApplicationURL = userObject._links[0].href;
                    sessionStorage.setItem("baseApplicationUrl", JSON.stringify(userApplicationURL));

                    return new apiService._get($http, userApplicationURL,
                         {
                             'Authorization': _token,
                         })
                                 
            .then(function (userApplicationResponse) {
                /* -assign token- */
                if (typeof $cookies.get('profile') !== const_auth.undefined)
                    $cookies.remove('profile');

                if (typeof sessionStorage._contentManagement !== const_auth.undefined)
                    sessionStorage.removeItem('_contentManagement');
                // get first application(node) from the response
                var firstApplicationObject = userApplicationResponse.data.data;
                sessionStorage.setItem('_contentManagement', JSON.stringify(firstApplicationObject));

                loginResponse._token = _token;
                $cookies.put('profile', JSON.stringify(loginResponse));
                $rootScope.profile = JSON.stringify($cookies.get('profile'));
                /* end token */
                return { status: true, toState: sessionStorage._toState };
            }).catch(function (resp) {
                return { status: false, statusText: resp.config.url + ' ' + resp.statusText };
            });
                                     }).catch(function (resp) {
                                         return { status: false, statusText: resp.config.url + ' ' + resp.statusText };
                                     });
               

            },
            authenticationToken: function (token) {
                return new apiService._get($http, APIEndpoint.auth,
                    {
                        'Authorization': 'Token ' + token,
                    })
                 .then(function (loginResponse) {
                     _token = loginResponse.headers('authentication-info');
                     // get the logged user Object
                     var userObject = loginResponse.data.data;
                     var userApplicationURL = userObject._links[0].href;
                     sessionStorage.setItem("baseApplicationUrl", JSON.stringify(userApplicationURL));

                     return new apiService._get($http, userApplicationURL,
                          {
                              'Authorization': _token,
                          })

             .then(function (userApplicationResponse) {
                 /* -assign token- */
                 if (typeof $cookies.get('profile') !== const_auth.undefined)
                     $cookies.remove('profile');

                 if (typeof sessionStorage._contentManagement !== const_auth.undefined)
                     sessionStorage.removeItem('_contentManagement');
                 // get first application(node) from the response
                 var firstApplicationObject = userApplicationResponse.data.data;
                 sessionStorage.setItem('_contentManagement', JSON.stringify(firstApplicationObject));

                 loginResponse._token = _token;
                 $cookies.put('profile', JSON.stringify(loginResponse));
                 $rootScope.profile = JSON.stringify($cookies.get('profile'));
                 /* end token */
                 return { status: true, toState: sessionStorage._toState };
             }).catch(function (resp) {
                 return { status: false, statusText: resp.config.url + ' ' + resp.statusText };
             });
                 }).catch(function (resp) {
                     return { status: false, statusText: resp.config.url + ' ' + resp.statusText };
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