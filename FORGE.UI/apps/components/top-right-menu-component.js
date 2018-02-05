(function () {
    'use strict';

    function controller($log, $state, $rootScope) {
        var tm = this;
        //$log.info('top right connect');

        $rootScope.$watch('currentLink', function (n, o){
            tm.currentLink = n;
        });



    }; //controller


    angular
        .module('app_topRightMenuComponent', [])
        .component('topRightMenuComponent', {
            templateUrl: 'apps/views/top-right-menu-component.html',
            controller: ['$log', '$state', '$rootScope', controller],
            controllerAs: 'tm',
            bindings: {
                link: '<',
                access: '<'
            }
        });
})();
