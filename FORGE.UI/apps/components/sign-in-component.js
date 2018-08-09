(function () {

    'use strict';

    var controller = function ($state, serviceEndpoint, $stateParams) {
        $('body').addClass("login-body");
        $('#IsBackToTopEnabled').hide();
        var vm = this;
        vm.loading = false;

        if ($stateParams.singleUseAuthenticationToken != null) {
            serviceEndpoint
                     .authenticationToken(decodeURI(atob($stateParams.singleUseAuthenticationToken)))
                     .then(function (resp) {
                         if (!resp.status) {

                             vm.error = resp.statusText;
                             return false;
                         }
                         $('body').removeClass("login-body");
                         $('#IsBackToTopEnabled').show();
                         $state.go(sessionStorage._toState || 'dashboard');
                     })
                     .catch(function (resp) {
                         vm.error = resp;
                     })
                     .finally(function () {
                         vm.loading = false;
                     })

        }
        if ($stateParams.serviceProviderErrorMessage != null) {
           
            vm.error = decodeURI(atob($stateParams.serviceProviderErrorMessage));
        }
        vm.login = function () {
            var _u = vm.username.trim() + ':' + vm.password;
            vm.loading = true;

            serviceEndpoint
                    .authentication(btoa(_u))
                    .then(function (resp) {
                        if (!resp.status) {
                            vm.error = resp.statusText;
                            return false;
                        }
                        $('body').removeClass("login-body");
                        $('#IsBackToTopEnabled').show();
                        $state.go(sessionStorage._toState || 'dashboard');
                    })
                    .catch(function (resp) {
                        vm.error = resp;
                    })
                    .finally(function () {
                        vm.loading = false;
                    })
            ; //srvendpoing

        };
    };

    controller.$inject = ['$state', 'serviceEndpoint', '$stateParams'];


    angular
    .module('app_signin', [])
    .component('signIn', {
        templateUrl: 'apps/views/sign-in-component.html',
        controller: controller,
        controllerAs: 'vm',

    })
    ;//module
})();