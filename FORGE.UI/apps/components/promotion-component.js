(function () {
    'use strict';

    function controller($log, $state) {
        var pm = this;
        //$log.info('promotion');


    }; //controller



    angular
       .module('app_promotionComponent', [])
       .component('promotionComponent', {
           templateUrl: 'apps/views/promotion-component.html',
           controller: ['$log', '$state', controller],
           controllerAs: 'pm',
           bindings: {
               link: '<',
               access: '<'
           }
       });
})();