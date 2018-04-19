﻿(function () {
    'use strict';

    var serviceAPI = function ($uibModal) {

        function registerToken(_profile) {
            return _profile;
        }; //authAPI

        return function () {
            return $uibModal.open({
                animation: true,
                component: 'authComponent'
            }).result.then(registerToken);
        }


    };//serviceAPI


    serviceAPI.$inject = ['$uibModal'];

    var removeUserToken = function ($cookies, Idle, $rootScope) {

        return function () {
            if (typeof $cookies.get('profile') !== const_auth.undefined) {
                $cookies.remove('profile');
                sessionStorage.clear();
                $rootScope.profile = undefined;
                Idle.unwatch();
            }
        }


    };//removeProfile
    removeUserToken.$inject = ['$cookies', 'Idle','$rootScope'];


    angular
        .module('app_service', [])
        .service('appService', serviceAPI)
        .service('removeUserToken', removeUserToken);

})();
