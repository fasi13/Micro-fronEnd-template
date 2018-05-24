var app = angular.module("contentEditorModule", [])
.filter('cap', function () {
    return function (input) {

        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})

.controller("contentEditor", function ($scope, $state, $stateParams, $cookies, $http, $timeout, apiService, $rootScope) {

    $scope.contentObj = {};
    $scope.retContentObj = {};
    $scope.newContent = {};
    $scope.newContent.showIcons = false;
    var _token = JSON.parse($cookies.get('profile'))._token;
    $scope.newContent = $stateParams.obj;
    $scope.currentContent = $stateParams.obj;
    $scope.retContentObj = $stateParams.retObj;
    $scope.contentObj.content_name = $stateParams.name;

    $scope.contentObj.performAction = function (content) {

        if ($scope.myform.$valid) {
            $scope.contentObj.editContent($scope.currentContent, content);
        }
    }
   
    $scope.contentObj.editContent = function (object, content) {
        $scope.tempContentData = content;
        var url = "";
        var requestObject = {};
        
        url = getURL(object._links, "updateContentValue");
        requestObject = {
            value: content.value,
            status: "Published"
        };

        apiService._put($http, url,
         requestObject, {
             "Authorization": _token,
             "Content-type": "application/json"
         })
        .then(function (response) {

            $state.go("dashboard.content-view", { obj: ($scope.retContentObj), name: $scope.contentObj.content_name });

        },
        function (error) {
        });

    }

    $scope.contentObj.cancelContent = function () {
        $state.go("dashboard.content-view", { obj: ($scope.retContentObj), name: $scope.contentObj.content_name });
    }

    function getURL(links, rel) {

        for (var i = 0; i < links.length; i++) {

            if (links[i].rel == rel) {
                return links[i].href;
            }
        }

    }

});