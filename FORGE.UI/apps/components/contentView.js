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




.controller("contentView", function ($scope, $state, $stateParams, $cookies, $http, $timeout) {


    $scope.contentObj = {};
    $scope.isCustomControls = false;
    $scope.newContent = {};
    $scope.newContent.showIcons = false;
    $scope.contentValidation = {};
    $scope.imgsrc = [];
    var _token = JSON.parse($cookies.get('profile'))._token;
    $scope.contentObj.completeObj = $stateParams.obj;
    $scope.copyContent = [];

    if ($scope.contentObj.completeObj != null) {

        $scope.contentObj.content = $scope.contentObj.completeObj.content;
        $scope.contentObj.contentAsList = getContentAsList($scope.contentObj.content);
        $scope.contentObj.contentAsGrid = getContentAsGrid($scope.contentObj.content);

        $scope.contentObj.dataTypeURL = $scope.contentObj.completeObj.dataTypeURL;
        getSupportingContent(getURL($scope.contentObj.completeObj._links, "supportingContent"));
        getDataTypes($scope.contentObj.dataTypeURL);
        $scope.contentObj.content_name = $stateParams.name;
        var _token = JSON.parse($cookies.get('profile'))._token;
    }

    function getContentAsList(contents) {
        var contentAsList = [];
        for (var i = 0; i < contents.length; i++) {

            if (contents[i].displayAsList) {
                contentAsList.push(contents[i]);
            }

        }
        return contentAsList;
    }
    function getContentAsGrid(contents) {
        var contentAsGrid = [];
        for (var i = 0; i < contents.length; i++) {

            if (!contents[i].displayAsList) {
                contentAsGrid.push(contents[i]);
            }

        }
        return contentAsGrid;
    }

    $scope.contentObj.setPreviousValue = function (newval, obj) {

        for (var i = 0; i < $scope.contentObj.content.length; i++) {

            if (obj.id == $scope.contentObj.content[i].id) {

                for (var j = 0; j < $scope.copyContent.length; j++) {

                    if ($scope.contentObj.content[i].id == $scope.copyContent[j].id) {

                        $scope.contentObj.content[i].value = $scope.copyContent[j].value;
                        $scope.newContent.showIcons = false;

                        break;

                    }

                }



            }
        }

    }
    $scope.contentObj.getValue = function (value, obj) {


        if (!$scope.newContent.showIcons) {
            $scope.copyContent.push({ id: angular.copy(obj.id), value: angular.copy(value) })


        }
    }
    function getSupportingContent(url) {
        if (url != undefined) {
            $http.get(url, {
                headers: {
                    "Authorization": _token

                }
            })
            .then(function (response) {
                $scope.supportingContent = response.data.data.value;




            }, function (error) {
                console.log(error);
            })
        }
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
      var tempContent = {};
      if ($scope.isCustomControls) {
          tempContent = responseContent;
      }
      else {
          tempContent = {
              name: responseContent.name,
              status: responseContent.status,
              publishDate: responseContent.publishDate,
              _links: responseContent._links
          };
      }
      $scope.contentObj.content.push(tempContent);
      $scope.contentObj.contentAsList = getContentAsList($scope.contentObj.content);
      $scope.contentObj.contentAsGrid = getContentAsGrid($scope.contentObj.content);
      $scope.myform.$submitted = false;
      $scope.newContent = {};
      $('#editContent').modal('hide');
  },
  function (error) {
      console.log(error);

  });


        }
    }

    $scope.contentObj.check_displayasList = function (content) {

        if (content == undefined || content.length == 0) {
            return true;
        }

        if (content != null) {

            return content.displayAsList;

        }
    };
    $scope.checkColorIsValid = function (color) {

        $scope.validColor = !(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color));
    }

    $scope.documentUpload = function (event) {

        var files = event.files;
        $scope.file = files[0];

        var ext = $scope.file.name.substr($scope.file.name.lastIndexOf('.') + 1);
        if (ext  == "pdf") {

            $scope.newContent.documentName = $scope.file.name;

            var reader = new FileReader();

            reader.onload = $scope.documentIsLoaded;
            reader.readAsDataURL($scope.file);

            $scope.dataURL = reader.result;
        }
        else {
            $scope.contentValidation.isValidExtension = true;
            $scope.$apply();
            $timeout(function () {
                $scope.contentValidation.isValidExtension = false;
            }, 2000);
        }

    }


    $scope.documentIsLoaded = function (e) {
        $scope.$apply(function () {


        });
    }
    function validateImageExtension(fld) {
        if (!/(\png|\jpg|\jpeg)$/i.test(fld)) {
            return false;
        }
        else
            return true;
    }

    $scope.imageUpload = function (event) {

        var files = event.files;
        $scope.file = files[0];


        


        var ext = $scope.file.name.substr($scope.file.name.lastIndexOf('.') + 1);
        if (validateImageExtension(ext)) {
            if (event.attributes.imgID != undefined) {
                $scope.imgID = event.attributes.imgID.value;
            }
            else {
                $scope.newContent.filename = $scope.file.name;
            }
            var reader = new FileReader();

            reader.onload = $scope.imageIsLoaded;
            reader.readAsDataURL($scope.file);

            $scope.dataURL = reader.result;
        }
        else {
            $scope.contentValidation.isValidExtension = true;
            $scope.$apply();
            $timeout(function () {
                $scope.contentValidation.isValidExtension = false;
            }, 2000);
        }

    }


    $scope.imageIsLoaded = function (e) {
        $scope.$apply(function () {


            $scope.modalImgsrc = "";
            $scope.modalImgsrc = e.target.result;
            var imgObject = { name: $scope.file.name, src: e.target.result, file: $scope.dataURL };
            $scope.imgsrc[$scope.imgID] = imgObject;

        });
    }
    $scope.contentObj.passContentForEdit = function (item, includeDataType, isUpdateContent) {
        $scope.modalImgsrc = "";
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
            $scope.newContent.isEditValue = true;
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

    $scope.contentObj.setAction = function (isAdd, includeDataType, isCustomControls) {
        $scope.modalImgsrc = "";
        $scope.myform.$submitted = false;
        $scope.isCustomControls = isCustomControls;
        $scope.IsUpdateContent = false;
        $scope.contentObj.isAdd = isAdd;
        $scope.newContent = {};
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
            else if ($scope.contentObj.isAdd == true) {
                $scope.contentObj.createContent(content);
            }
        }
    }


    $scope.contentObj.editContentCustomizeBranding = function (object, value) {
        $scope.newContent.showIcons = false;

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

            $scope.isPropertySaved = true;

            $timeout(function () {
                $scope.isPropertySaved = false;
            }, 2000);
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

                name: content.name,
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

            $scope.myform.$submitted = false;
            $scope.newContent = {};
            $('#editContent').modal('hide');
            if ($scope.IsUpdateContent) {
                UpdateContentArray($scope.tempContentData);
                $scope.contentObj.contentAsList = getContentAsList($scope.contentObj.content);
                $scope.contentObj.contentAsGrid = getContentAsGrid($scope.contentObj.content);
            }
            else if ($scope.IsUpdateContent) {
                UpdateContentValueArray($scope.tempContentData);
                $scope.contentObj.contentAsList = getContentAsList($scope.contentObj.content);
                $scope.contentObj.contentAsGrid = getContentAsGrid($scope.contentObj.content);
            }

        },
        function (error) {
            console.log(error);
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