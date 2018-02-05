(function() {
    'use strict';


    function controller($http) {
        var vm = this;
        vm.loading = false;
        
        var http = function (_user) {
            $http
                .get('https://toolsservices-qa.awardcenter.com/test', {
                    headers: {
                        'Authorization': 'Basic ' + btoa(_user),
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                })
                .then(function (resp) {
                    vm.close({
                        $value: resp
                    });
                })
                .catch(function (resp) {
                    vm.error = resp.statusText;
                    return resp.statusText;
                })
                .finally(function () {
                    vm.loading = false;
                });
        };
          
       
        vm.login = function () {

            vm.loading = true;
            var _u = vm.username.trim() + ':' + vm.password;
            setTimeout(function () {
                http(_u);
            }, 2000);

           

        };

        vm.cancel = function () {
            vm.dismiss({ $value: 499 });
        };

    }; //controller


    controller.$inject = ['$http'];

    angular.module('app_auth', [])
        .component('authComponent', {
            templateUrl: 'apps/views/auth-component.html',
            controller: controller,
            controllerAs: 'vm',
            bindings: {
                resolve: '<',
                close: '&',
                dismiss: '&'
            }
        });
})();