(function () {
    'use strict';

    var controller = function () {
        var et = this;

       
        et.$onInit = function () {
            //  et = et.result;
            //  console.log(et.result);
        };

    };

    controller.$inject = [];

    angular
        .module('app_content_management', [])
        .component('contentManagementComponent', {
            templateUrl: 'apps/views/content-management-component.html',
            controller: controller,
            controllerAs: 'et',
            bindings: {
                result: '<'
            }
        })
    ;//-
        

})();