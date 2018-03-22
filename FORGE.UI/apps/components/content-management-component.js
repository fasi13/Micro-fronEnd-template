(function () {
    'use strict';

    var controller = function ($scope, $stateParams, $cookies, $http, updateContentGroup, apiService, $state, update_breadcrumbs) {

        $scope.contentGroup = {};
        var _token = JSON.parse($cookies.get('profile'))._token;
        if ($stateParams.obj != null) {
            $scope.contentGroup.content = $stateParams.obj.items;
            $scope.contentGroup._links = $stateParams.obj._links
            $scope.contentGroup.dataTypeURL = $stateParams.dataTypeURL;
            getDataTypes($scope.contentGroup.dataTypeURL);
        }

        $scope.contentGroup.loadContents = function (content) {

          

            $scope.contentGroup.contentName = content.name;
            $scope.clickedNode = update_breadcrumbs.configuredNode._links;
            $scope.contentGroup.dataTypeURL = getdataTypeURL($scope.clickedNode);
            var url, links = content._links;
            for (var i = 0; i < links.length; i++) {

                if (links[i].rel == "self") {
                    url = links[i].href;
                }
            }

            apiService.get(url + "?content=true",
                                    contentLoadSuccessfully,
                                    contentLoadFailed, _token);

        }

        function getdataTypeURL(links) {
           
            for (var i = 0; i < links.length; i++) {

                if (links[i].rel == "self") {

                    return links[i].href + "/dataTypes";
                }
            }

        }

        function contentLoadFailed(data) {

            console.log(data);
        }



        function contentLoadSuccessfully(response) {

            $scope.contentGroup.content = response.data.data.content;

            $scope.contentGroup.content.dataTypeURL = $scope.contentGroup.dataTypeURL;

            
            $state.go("dashboard.content-view", { obj: ($scope.contentGroup), name: $scope.contentGroup.contentName });


        }


        function getDataTypes(url) {
            
            $http.get(url, {


                headers: {
                    "Authorization": _token


                }
            })
            .then(function (response) {
                
                $scope.contentGroup.dataTypeList = response.data.data.items;


            }, function (error) {
                console.log(error);
            })
        }
        $scope.contentGroup.performAction = function (content) {
            if ($scope.myform.$valid) {
                if ($scope.contentGroup.isAdd == false) {
                    $scope.contentGroup.editContent($scope.currentContent, content, true);
                }
                else if ($scope.contentGroup.isAdd == true) {
                    $scope.contentGroup.createContent(content);
                }
            }
        }
        function getURL(links, rel) {

            for (var i = 0; i < links.length; i++) {

                if (links[i].rel == rel) {
                    return links[i].href;
                }
            }

        }
        $scope.contentGroup.createContent = function (content) {
            var url, links;

            links = $scope.contentGroup._links;
            url = getURL(links, "createContentGroup");

            $http.post(url,
       {
           name: content.name,
           value: content.value,
           status: "Published",
           dataType: {
               name: content.selectedDataType.name,
               type: content.selectedDataType.name
           }

       }, {
           headers: {
               "Authorization": _token,
               "Content-type": "application/json"
           }
       })
  .then(function (response) {

      var responseContent = response.data.data;
      updateContentGroup.setContentGroup(responseContent, true);
      var tempContent = {
          name: responseContent.name,
          status: responseContent.status,
          publishDate: responseContent.publishDate,
          _links: responseContent._links
      };
      $scope.contentGroup.content.push(tempContent);
      $scope.myform.$submitted = false;
      $scope.newContent = {};
      $('#editContent').modal('hide');
  },
  function (error) {
      console.log(error);

  });
        }
        $scope.contentGroup.editContent = function (object, content) {
            $scope.tempContentData = content;
            var url = "";
            var requestObject = {
                name: content.name,
                value: content.value,
                status: "Published"
            };
            url = getURL(object._links, "updateContentGroup");
            $http.put(url,
            requestObject, {
                headers: {
                    "Authorization": _token,
                    "Content-type": "application/json"
                }
            })
            .then(function (response) {
                $scope.myform.$submitted = false;
                $scope.newContent = {};

                $('#editContent').modal('hide');
               
                updateContentGroup.setContentGroup($scope.tempContentData, false);
                UpdateContentGroupArray($scope.tempContentData);
            },
            function (error) {
                alert(error);
            });

        }
        function UpdateContentGroupArray(currentData) {

            for (var i = 0; i < $scope.contentGroup.content.length; i++) {
                if ($scope.contentGroup.content[i].id == currentData.ID) {

                    $scope.contentGroup.content[i].name = currentData.name;
                    $scope.contentGroup.content[i].value = currentData.value;
                }
            }
        }
        $scope.contentGroup.setAction = function (isAdd, includeDataType) {
            $scope.contentGroup.isAdd = isAdd;
            $scope.isDataTypePropertyEnabled = includeDataType;
        }
        $scope.contentGroup.passContentForEdit = function (item, includeDataType) {

            $scope.isDataTypePropertyEnabled = includeDataType;
            $scope.contentGroup.isAdd = false;
            $scope.newContent = {};
            $scope.newContent.name = item.name;
            $scope.newContent.ID = item.id;
            $scope.newContent.value = item.value;
            $scope.currentContent = item;
        }
    };




    controller.$inject = ['$scope', '$stateParams', '$cookies', '$http', 'updateContentGroup', 'apiService', '$state', 'update_breadcrumbs'];




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