(function () {
    'use strict';
    var controller = function ($scope,$stateParams,$cookies,$http) {

        var et = this;

      
        et.contentGroup = $stateParams.obj;

        et.editContentGroup = function () {
            var _token = JSON.parse($cookies.get('profile'))._token;
            $http.put(url,
            { "name": $scope.contentGroupName }, {
                headers: {
                    "Authorization": token,
                    "Content-type": "application/json"
                }
            })
       .then(function (response) {

       },
       function (error) {

       })


        }
        et.passContentGroupName = function (name, id) {


            $scope.contentGroupName = name;
            $scope.contentGroupID = id;

        }

        et.$onInit = function () {
            //  et = et.result;
            //  console.log(et.result);
        };

    };
    controller.$inject = ['$scope','$stateParams','$cookies','$http'];


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