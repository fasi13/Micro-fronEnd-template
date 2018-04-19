(function () {
    'use strict';

    angular
            .module('app_router', ['ngCookies', 'ngIdle'])
            .config([
                '$stateProvider', '$urlRouterProvider', 'IdleProvider', 'KeepaliveProvider', '$httpProvider',
                function ($stateProvider, $urlRouterProvider, IdleProvider, KeepaliveProvider, $httpProvider) {

                    // Register interceptors service
                    $httpProvider.interceptors.push('interceptors');

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
                                    controller: ['$scope', '$cookies', '$state', 'logoimg', 'Idle', '$uibModal', 'removeUserToken', function ($scope, $cookies, $state, logoimg, Idle, $uibModal, removeUserToken) {
                                        $scope.sessionTime = 15 * 60; //15 minutes
                                        $scope.sessionTimeOutCount = 0;
                                        IdleProvider.timeout(0);
                                        KeepaliveProvider.interval(1);
                                        Idle.watch();
                                        if (typeof $cookies.get('profile') === const_auth.undefined) {
                                            $state.go('sign-in');
                                            return;
                                        }
                                        else {
                                            var db = this,
                                                model = JSON.parse(sessionStorage._contentManagement),
                                                linkList = [];

                                            db.username = JSON.parse($cookies.get('profile')).data.data.name;
                                            var cnt = 0;
                                            angular.forEach(model.items, function (v, k) {
                                                linkList.push({
                                                    id: cnt++,
                                                    appId: v.id,
                                                    getApplication: v.name,
                                                    href: v._links[0].href
                                                });
                                            });
                                            $scope.$on("updatelogoIMG", function () {

                                                $scope.logoURL = logoimg.PrimaryLogoURL;
                                            });

                                            $scope.$on("updateSessionTimeOutCount", function () {
                                                $scope.sessionTimeOutCount = 0;
                                            });

                                            function sessionTimeOut() {
                                                sessionTimeOutModals();
                                                $scope.warning = $uibModal.open({
                                                    templateUrl: 'warning-dialog.html',
                                                    windowClass: 'modal-danger',
                                                    controller: 'SessionLogoutCtrl',
                                                    backdrop: 'static',
                                                    keyboard: false
                                                });
                                                removeUserToken();
                                            };

                                            $scope.$on('Keepalive', function () {
                                                if ($scope.sessionTimeOutCount >= $scope.sessionTime) {
                                                    sessionTimeOut();
                                                }
                                                $scope.sessionTimeOutCount++;
                                            });

                                            function sessionTimeOutModals() {
                                                if ($scope.warning) {
                                                    $scope.warning.close();
                                                    $scope.warning = null;
                                                }
                                            }

                                            db.links = linkList;
                                            db.logout = function () {
                                                sessionTimeOutModals();
                                                removeUserToken();
                                                $state.go('sign-in');
                                            }; //logout
                                        }
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
                        //.state('dashboard.content-manager', {
                        //    url: '/content-manager',
                        //    params:{
                        //        contentId: 0
                        //    },
                        //    views: {
                        //        'content-manager@dashboard': {
                        //            template: '<content-management-component result="$resolve.result"></content-management-component>',
                        //            resolve: {
                        //                result: ['serviceEndpoint', '$stateParams', function (serviceEndpoint, $stateParams) {
                        //                    return serviceEndpoint.contentManagement($stateParams.contentId)
                        //                           .then(function (resp) {
                        //                               return resp.data.data;
                        //                           })
                        //                       .catch(function (resp) {
                        //                           return resp;
                        //                       })
                        //                    ; //srv
                        //                }]
                        //            },
                        //        },
                        //    }
                        //})

                    .state('dashboard.content-management', {
                        url: '/content-management',
                        params: {
                            obj: null,
                            dataTypeURL: null
                        },
                        template: '<content-management-component></content-management-component>'



                    })
                     .state('dashboard.content-view', {
                         url: '/content-view',
                         cache: false,
                         params: {
                             obj: null,
                             name: "Template Name"
                         },

                         templateUrl: 'apps/views/contentView.html',
                         controller: "contentView"

                     })
                        .state('dashboard.change-password', {
                            url: '/change-password',
                            cache: false,

                            templateUrl: 'apps/views/change-password.html',
                            controller: "change-password"

                        })


                    //-
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
                auth: const_APIUrl + '/users/me'
            })
    ;//module
})();