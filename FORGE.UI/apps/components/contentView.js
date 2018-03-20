var app = angular.module("contentsModule", [])
.filter('cap', function () {
    return function (input) {

        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})
.directive('fileModel', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('change', function () {
                $parse(attrs.fileModel).assign(scope, element[0].files)
                scope.$apply();
            });
        }
    };
})

.controller("contentView", function ($scope, $stateParams, $cookies, $http, $state) {

    $scope.contentObj = {};
    var _token = JSON.parse($cookies.get('profile'))._token;
    $scope.contentObj.completeObj = JSON.parse($stateParams.obj);
    if ($scope.contentObj.completeObj != null) {
        debugger;
        $scope.contentObj.content = $scope.contentObj.completeObj.content;
        $scope.contentObj.dataTypeURL = $scope.contentObj.completeObj.dataTypeURL;
        getDataTypes($scope.contentObj.dataTypeURL);
    }


    function getDataTypes(url) {


        $http.get(url, {
            headers: {
                "Authorization": _token

            }
        })
        .then(function (response) {

            $scope.contentObj.dataTypeList = response.data.data.items;


        }, function (error) {
            console.log(error);
        })
    }
    $scope.contentObj.content_name = $stateParams.name;
    var _token = JSON.parse($cookies.get('profile'))._token;

    $scope.contentObj.createContent = function (content) {
        var url, links;


        if ($scope.contentObj.completeObj != null && content.name) {

            links = $scope.contentObj.completeObj._links;
            url = getURL(links, "createContent");

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
      var tempContent = {
          name: responseContent.name,
          status: responseContent.status,
          publishDate: responseContent.publishDate,
          _links: responseContent._links
      };
      $scope.contentObj.content.push(tempContent);

      $('#editContent').modal('hide');
  },
  function (error) {
      console.log(error);

  });


        }
    }

    $scope.contentObj.check_displayasList = function (content) {

        if (content != null) {

            return content[0].displayAsList;

        }
    };
    $scope.contentObj.passContentForEdit = function (item, includeDataType, isUpdateContent) {

        $scope.isDataTypePropertyEnabled = includeDataType;
        $scope.contentObj.isAdd = false;
        $scope.IsUpdateContent = isUpdateContent;
        if (isUpdateContent) {
            $scope.newContent = {};
            $scope.newContent.name = item.name;
            $scope.newContent.ID = item.id;
            $scope.newContent.value = item.value;
            $scope.currentContent = item;
        }
        else if (isUpdateContent == false) {
            $scope.newContent = {};
            $scope.newContent.ID = item.id;
            $scope.newContent.value = item.value;
            $scope.currentContent = item;
        }
    }

    function getURL(links, rel) {

        for (var i = 0; i < links.length; i++) {

            if (links[i].rel == rel) {
                return links[i].href;
            }
        }

    }

    $scope.contentObj.setAction = function (isAdd, includeDataType) {
        $scope.IsUpdateContent = false;
        $scope.contentObj.isAdd = isAdd;
        $scope.isDataTypePropertyEnabled = includeDataType;
    }

    $scope.contentObj.performAction = function (content) {


        if ($scope.myform.$valid) {

            if ($scope.contentObj.isAdd == false && $scope.IsUpdateContent == true) {


                $scope.contentObj.editContent($scope.currentContent, content, true);

				

            }
            else if ($scope.contentObj.isAdd == false && $scope.IsUpdateContent == false) {

                $scope.contentObj.editContent($scope.currentContent, content, false);
            }
            else if ($scope.contentObj.isAdd == false && $scope.IsUpdateContent == false) {


                $scope.contentObj.editContent($scope.currentContent, content, false);


            }

			
            else if ($scope.contentObj.isAdd == true) {
                $scope.contentObj.createContent(content);
            }
        }
    }


    $scope.contentObj.editContentCustomizeBranding = function (object, value) {

        var url = getURL(object._links, "updateContentValue");
        var requestObject = {
            value: value,
            status: "Published"
        };

        $http.put(url,
        requestObject, {
            headers: {
                "Authorization": _token,
                "Content-type": "application/json"
            }
        })
        .then(function (response) {

        },
        function (error) {


        });


    }


    $scope.contentObj.editContent = function (object, content, isUpdateContent) {
        $scope.IsUpdateContent = isUpdateContent;
        $scope.tempContentData = content;
        var url = "";
        var requestObject = {};

        if (isUpdateContent) {
            url = getURL(object._links, "updateContent");
            requestObject = {
                name: content.name,
                value: content.value,
                status: "Published"
            };
        }
        else if (isUpdateContent == false) {
            url = getURL(object._links, "updateContentValue");
            requestObject = {
                value: content.value,
                status: "Published"
            };
        }
        $http.put(url,
        requestObject, {
            headers: {
                "Authorization": _token,
                "Content-type": "application/json"
            }
        })
        .then(function (response) {
            $('#editContent').modal('hide');

            if ($scope.IsUpdateContent) {
                UpdateContentArray($scope.tempContentData);
            }
            else if ($scope.IsUpdateContent) {
                UpdateContentValueArray($scope.tempContentData);
            }
        },
        function (error) {
            alert(error);
        });

    }
    function UpdateContentArray(currentData) {

        
        for (var i = 0; i < $scope.contentObj.content.length; i++) {
            if ($scope.contentObj.content[i].id == currentData.ID) {
                

                $scope.contentObj.content[i].name = currentData.name;
                $scope.contentObj.content[i].value = currentData.value;
            }
        }
    }
    function UpdateContentValueArray(currentData) {

        
        for (var i = 0; i < $scope.contentObj.content.length; i++) {
            if ($scope.contentObj.content[i].id == currentData.ID) {
                

                $scope.contentObj.content[i].value = currentData.value;
            }
        }
    }
});