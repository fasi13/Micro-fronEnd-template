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


.controller("contentView", function ($scope, $stateParams, $cookies, $http) {

    $scope.contentObj = {};
    var _token = JSON.parse($cookies.get('profile'))._token;
    $scope.contentObj.completeObj = JSON.parse($stateParams.obj);
    if ($scope.contentObj.completeObj != null) {
        $scope.contentObj.content = $scope.contentObj.completeObj.content;
        $scope.contentObj.dataTypeURL = $scope.contentObj.completeObj.dataTypeURL;
        getDataTypes($scope.contentObj.dataTypeURL);
    }


    function getDataTypes(url) {

        
        $http.get(url, {headers: {
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
        var url , links;


        if ($scope.contentObj.completeObj != null && content.name) {

            links = $scope.contentObj.completeObj._links;
            url = getURL(links, "createContent");

            $http.post(url,
       {
           "name": content.name,
           "status": "Published",
           "dataType": {
               "name": content.selectedDataType.name
           }
           
       }, {
           headers: {
               "Authorization": _token,
               "Content-type": "application/json"
           }
       })
  .then(function (response) {
      var responseContent = response.data.data;
      $scope.contentObj.content.push(responseContent);
   
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
    $scope.contentObj.passContentName = function (item) {
        $scope.newContent = {};
        $scope.newContent.name = item.name;
       
        $scope.newContent.ID = item.id;
        $scope.newContent.value = item.vaue;
        $scope.contentObj.action = "edit";
        $scope.currentContent= item;

    }

    function getURL(links,rel) {

        for (var i = 0; i < links.length; i++) {

            if (links[i].rel == rel) {
               return links[i].href;
            }
        }

    }

    $scope.contentObj.setAction = function(){
        $scope.contentObj.action = "add";
    }
    
    $scope.contentObj.performAction = function (content) {
       
        
        if ($scope.myform.$valid) {

            if ($scope.contentObj.action == "edit") {

                $scope.contentObj.editContent($scope.currentContent, content);


            }

            else {
                $scope.contentObj.createContent(content);
            }
        }
    }


    $scope.contentObj.editContentCustomizeBranding = function (object, value) {

        var url = getURL(object._links, "updateContentValue");
        var requestObject = {
            "name": object.name,
            "value": value,
            "status": "Published",
            "dataType": {
                "name": object.dataType.name
            }
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


    $scope.contentObj.editContent = function (object,content) {
      
           
            var url = getURL(object._links, "updateContentValue");
            var requestObject = {
                "name": content.name,
                "value": content.name,
                "status": "Published",
                "dataType": {
                    "name": object.dataType.name
                }
            };

            $http.put(url,
            requestObject, {
                headers: {
                    "Authorization": _token,
                    "Content-type": "application/json"
                }
            })
            .then(function (response) {

                console.log(response);
            },
            function (error) {

                console.log(error);
            });
        
    }
});