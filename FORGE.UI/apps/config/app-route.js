(function () {
    'use strict';

    angular
            .module('app_router', ['ngCookies'])
            .config([
                '$stateProvider', '$urlRouterProvider',
                function ($stateProvider, $urlRouterProvider) {
                    $urlRouterProvider.otherwise('/');
                    $stateProvider
                        .state('sign-in', {
                            url: '/',
                            template: '<sign-in></sign-in>',
                            data: {
                                requireLogin: const_request.notrequire
                            },
                        }) //-
                        .state('dashboard', {
                            url: '/dashboard',
                            views: {
                                '': {
                                    templateUrl: 'apps/views/_dashboard.html',
                                    controller: ['$cookies' , '$state', function ($cookies, $state) {
                                        var db = this,
                                            model = JSON.parse(sessionStorage._contentManagement),
                                            linkList = [];
                                   
                                        db.username = JSON.parse($cookies.get('profile')).data.data.name;
                                        var cnt = 0;
                                        angular.forEach(model.items, function (v, k) {
                                            linkList.push({
                                                id:cnt++,
                                                appId: v.id,
                                                getApplication: v.name,
                                                href: v._links[0].href
                                            });
                                        });

                                        db.links = linkList;
                                        db.logout = function () {
                                            if (typeof $cookies.get('profile') !== const_auth.undefined) {
                                                $cookies.remove('profile');
                                                sessionStorage.clear();

                                                $state.go('sign-in');
                                            }
                                        }; //logout
                                    }],
                                    controllerAs: 'db'
                                },
                                'left-menu@dashboard': {
                                    template: '<left-menu-component nav-links="db.links"></left-menu-component>'
                                },
                               
                            },
                            data: {
                                requireLogin: const_request.require
                            }
                            
                        }) //-
                        .state('dashboard.content-manager', {
                            url: '/content-manager',
                            params:{
                                contentId: 0
                            },
                            views: {
                                'content-manager@dashboard': {
                                    template: '<content-management-component result="$resolve.result"></content-management-component>',
                                    resolve: {
                                        result: ['serviceEndpoint', '$stateParams', function (serviceEndpoint, $stateParams) {
                                            return serviceEndpoint.contentManagement($stateParams.contentId)
                                                   .then(function (resp) {
                                                       return resp.data.data;
                                                   })
                                               .catch(function (resp) {
                                                   return resp;
                                               })
                                            ; //srv
                                        }]
                                    },
                                },
                            }
                        }) //-
                    //    .state('dashboard.content-pages', {
                    //        url: '/dashboard',
                    //        views: {
                    //            'contentPages@dashboard': {
                    //                template: '<content-management-component></content-management-component>'
                    //            },
                    //        }
                    //    }) //
                    // .state('dashboard.welcome-page', {
                    //     url: '/dashboard',
                    //     views: {
                    //         'welcomePage@dashboard': {
                    //             template: '<h1>welcome-page</h1>'
                    //         },
                    //     }
                    // }) //
                    //.state('dashboard.customize-branding', {
                    //    url: '/dashboard',
                    //    views: {
                    //        'customizeBranding@dashboard': {
                    //            template: '<h1>customize-branding</h1>'
                    //        },
                    //    }
                    //}) //
                    //;//stateProvider
                } //fn
            ]) //config
            .run([
                '$rootScope', '$state', '$cookies', 'appService',
                function ($rootScope, $state, $cookies, srvAPI) {

                     if (typeof $cookies.get('profile') !== const_auth.undefined) {
                        $rootScope.profile = JSON.parse($cookies.get('profile'));
                    }

                    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                        var rQ = toState.data.requireLogin;

                        if (typeof $cookies.get('profile') !== const_auth.undefined) {
                            $rootScope.profile = JSON.parse($cookies.get('profile'));
                        }
                        /* modal login */
                        //if (rQ && typeof $rootScope.profile === const_auth.undefined) {
                        //    event.preventDefault();
                        //    srvAPI().then(function (resp) {
                        //        if (typeof $cookies.get('profile') !== const_auth.undefined) {
                        //            $cookies.remove('profile');
                       //        }
                        //        resp._token = resp.headers('authentication-info');
                        //        $cookies.put('profile', JSON.stringify(resp));
                        //        $rootScope.profile = JSON.parse($cookies.get('profile'));
                        //        return $state.go(toState);
                        //    }).catch(function () {
                        //        return $state.go('dashboard');
                        //    });
                        //}
                        /* form-login */
                        if (rQ && (typeof $rootScope.profile === const_auth.undefined || !sessionStorage.length)) {
                            event.preventDefault();
                            if (typeof sessionStorage.getItem('_toState') !== const_auth.undefined)  
                                sessionStorage.removeItem('_toState');
                            sessionStorage.setItem('_toState', toState.name);
                            $state.go('sign-in');
                        }
                    });


                    $rootScope.$on('$stateChangeSuccess', function (evt, toState) {

                        //if (toState.name === 'sign-in' && typeof $rootScope.profile !== const_auth.undefined)
                        //    $state.go('dashboard');
                        //$rootScope.currentLink = toState.name;
                    });
                } //fn
            ]) //run
            .constant('APIEndpoint', {
                auth: 'https://toolsservices-qa.awardcenter.com/users/me'
            }) //https://toolsservices-qa.awardcenter.com/users/me
    ;//module
})();