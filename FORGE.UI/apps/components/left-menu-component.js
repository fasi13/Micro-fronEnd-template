(function () {
    'use strict';

    function controller($log, $state, $rootScope) {
        var lm = this;
        
        lm.status = {
            isDashboard :false,
            isContentMgmt: false,
            isPromotion: false,
            isSetting:false,
        };

        lm.$onInit = function () {
            lm.status.isContentMgmt = true;
        }

        lm.goTo = function (site) {

            
            $state.go(site);
        };

       
    }; //controller



    angular
       .module('app_leftMenuComponent',[])
       .component('leftMenuComponent', {
           templateUrl: 'apps/views/left-menu-component.html',
           controller: ['$log', '$state', '$rootScope', controller],
           controllerAs: 'lm',
           bindings: {
               navLinks: '<',
               access: '<'
           }
       });
})();
