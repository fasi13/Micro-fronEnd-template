(function () {
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

    angular
        .module('app_service', [])
        .service('appService', serviceAPI);

})();
