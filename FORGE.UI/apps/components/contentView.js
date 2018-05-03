var app = angular.module("contentsModule", [])
.filter('cap', function () {
    return function (input) {

        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})



app.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|blob):/);
}])

.controller("contentView", function ($scope, $state, $stateParams, $cookies, $http, $timeout, apiService, $rootScope, isStateChange, stateChangeData, update_brandingContent) {

    $scope.isSuccess = false;
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
        var i = 0;
        var length = contents.length;
        for (i; i < length; i++) {

            if (contents[i].displayAsList) {
                contentAsList.push(contents[i]);
            }

        }
        return contentAsList;
    }
    function getContentAsGrid(contents) {
        var contentAsGrid = [];
        var i = 0;
        var length = contents.length;
        for (i; i < length; i++) {

            if (!contents[i].displayAsList) {
                contentAsGrid.push(contents[i]);
            }

        }
        return contentAsGrid;
    }

    $scope.contentObj.setPreviousValue = function (obj, previousObject) {

        for (var i = 0; i < obj.length; i++) {

            for (var j = 0; j < $scope.copyContent.length; j++) {

                if (obj[i] == undefined) {
                    break;
                }
                if (previousObject.id == $scope.copyContent[j].id && previousObject.id == obj[i].id) {
                    previousObject.valueChange = false;
                    previousObject.showIcons = false;

                    obj[i] = previousObject;



                    obj[i].value = $scope.copyContent[j].value;


                    if (obj[i].showIcons !== undefined) {

                        obj[i].showIcons = false;

                    }
                    return $scope.copyContent[j].value;

                }

            }
        }

    }
    $scope.contentObj.getValue = function (value, obj) {

        if (!obj.showIcons) {
            $scope.copyContent.push({ id: angular.copy(obj.id), value: angular.copy(value), name: angular.copy(obj.name) })


        }
    }
    function getSupportingContent(url) {
        if (url != undefined) {
            apiService._get($http, url, {
                "Authorization": _token
            })
            .then(function (response) {
                $scope.supportingContent = response.data.data.value;




            }, function (error) {
            })
        }
    }
    function getDataTypes(url) {


        apiService._get($http, url, {
            "Authorization": _token
        })
        .then(function (response) {

            $scope.contentObj.dataTypeList = response.data.data.items;

        }, function (error) {
        })
    }


    $scope.contentObj.createContent = function (content) {
        var url, links;


        if ($scope.contentObj.completeObj != null && content.name) {

            links = $scope.contentObj.completeObj._links;
            url = getURL(links, "createContent");

            apiService._post($http, url,
       {
           name: content.name,
           value: content.value,
           status: "Published",
           dataType: {
               name: content.selectedDataType.name,
               type: content.selectedDataType.name
           }
       }, {
           "Authorization": _token,
           "Content-type": "application/json"
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
          $scope.errorDescription = (typeof error.data.fields !== "undefined") ? error.data.fields.value.toString() : error.description.toString();
          $timeout(function () {
              $scope.errorDescription = undefined;
          }, 2000);

      });

        }

    }

    $scope.checkColorIsValid = function (color) {

        $scope.validColor = !(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color));
        return $scope.validColor;
    }

    $scope.documentUpload = function (element) {

        var files = element.files;
        $scope.file = files[0];

        var ext = $scope.file.name.substr($scope.file.name.lastIndexOf('.') + 1);

        if (ext == "pdf") {

            if (element.attributes.documentID != undefined) {

                $scope.documentID = element.attributes.documentID.value;
                $scope.imgsrc[$scope.documentID] = {};
                $scope.imgsrc[$scope.documentID].valueChange = true;
            }
            else {
                $scope.newContent.filename = $scope.file.name;

            }
            var reader = new FileReader();
            reader.readAsDataURL($scope.file);
            reader.addEventListener("loadend", function (e) {


                $scope.documentBase64 = $scope.file.name + ":" + e.target.result.split(',')[1];
                $scope.newContent.value = $scope.documentBase64;

                $scope.$apply(function () {
                    var fileObject = { id: $scope.documentID, value: URL.createObjectURL($scope.file), showIcons: true };

                    $scope.imgsrc[$scope.documentID] = fileObject;
                    element.value = '';
                });


            });

        }
        else {

            $scope.documentID = element.attributes.documentID.value;
            $scope.imgsrc[$scope.documentID].isValidExtension = true;
            $scope.$apply();
            element.value = '';
            $timeout(function () {
                $scope.imgsrc[$scope.documentID].isValidExtension = false;
            }, 2000);
        }

    }



    function validateImageExtension(fld) {
       
        if (/(png|\jpg|\jpeg|svg|\gif)$/i.test(fld)) {
            return true;
        }
        else
            return false;
    }

    $scope.imageUpload = function (element) {


        var files = element.files;
        $scope.file = files[0];


        var ext = $scope.file.name.substr($scope.file.name.lastIndexOf('.') + 1);


        if ( validateImageExtension(ext)) {

            $scope.newContent.valueChange = true;
            if (element.attributes.imgObject != undefined) {

                var imgObject = JSON.parse(element.attributes.imgObject.value);
                $scope.imgsrc[imgObject.id] = {};
                $scope.imgObject = imgObject.id;
                $scope.imgsrc[imgObject.id].valueChange = true;

            }
            else {
                $scope.newContent.filename = $scope.file.name;

            }




            var reader = new FileReader();

            reader.readAsDataURL($scope.file);
            reader.onloadend = function (e) {

                $scope.imageBase64 = $scope.file.name + ":" + e.target.result.split(',')[1];
                $scope.newContent.value = $scope.imageBase64;

                $scope.$apply(function () {

                    $scope.modalImgsrc = "";

                    $scope.modalImgsrc = URL.createObjectURL($scope.file);

                    if (element.attributes.imgObject != undefined) {

                        var imgObject = { id: $scope.imgObject, value: $scope.modalImgsrc, showIcons: true };
                        $scope.imgsrc[$scope.imgObject] = imgObject;
                        element.value = '';
                    }
                });

            };






        }
        else {


            $scope.imgsrc[$scope.imgObject].isValidExtension = true;
            $scope.$apply();
            element.value = '';
            $timeout(function () {
                $scope.imgsrc[$scope.imgObject].isValidExtension = false;
            }, 2000);
        }

    }





    function getContentValue(content) {

        var url = getURL(content._links, "self");
        apiService.get(url, ContentValueLoadSuccessfully, ContentValueLoadFailed, _token);

    }

    function ContentValueLoadSuccessfully(result) {



        $scope.newContent = {};
        $scope.newContent.isEditValue = true;

        $scope.newContent.id = result.data.data.id;
        $scope.newContent.name = result.data.data.name;
        $scope.newContent.value = result.data.data.value;
        $scope.currentContent = result.data.data;


    }

    function ContentValueLoadFailed(error) {



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


            getContentValue(item);


        }
    }

    function getURL(links, rel) {

        var i = 0;
        var length = links.length;


        for (i; i < length; i++) {

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
    function isFileUploaded() {
        var i = 0;

        var length = $scope.imgsrc.length;
        for (i; i < length; i++) {
            if ($scope.imgsrc[i] !== undefined && $scope.imgsrc[i].showIcons) {

                return false;
            }
        }
        return true;

    }

    function isValueUpdated() {
        if ($scope.contentObj.contentAsGrid !== undefined) {
            var i = 0;

            var length = $scope.contentObj.contentAsGrid.length;
            for (i; i < length; i++) {
                if ($scope.contentObj.contentAsGrid[i].valueChange) {

                    return false;
                }
            }

        }
        return true;

    }


    function getObjectIndex(contentArray, updatedObject) {
        var i = 0;

        var Length = contentArray.length;
        for (i = 0; i < Length; i++) {

            if (updatedObject.id == contentArray[i].id) {

                return i;
            }
        }
        return -1;
    }





    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if ((!isValueUpdated() || !isFileUploaded())) {
            $("#navigationPopup").modal("show");

            stateChangeData.stateData = { toState: toState, toParams: toParams, fromState: fromState, fromParams: fromParams };

            event.preventDefault
                ();

        }

    });

    $scope.stateChange = function () {
        isStateChange.buttonClicked = true;
        restorePreviousValues();
        restorePreviousImages();
        $("#navigationPopup").modal("hide");

    }
    $(document).on('hidden.bs.modal', '#navigationPopup', function () {
        if (isStateChange.buttonClicked) {
            isStateChange.buttonClicked = false;
            $scope.goToNewState();
        }
    });

    $scope.goToNewState = function () {


        $state.go(stateChangeData.stateData.toState.name, { obj: stateChangeData.stateData.toParams.obj, dataTypeURL: stateChangeData.stateData.toParams.dataTypeURL });

    }

    function restorePreviousImages() {

        var i = 0;

        var length = $scope.imgsrc.length;
        for (i; i < length; i++) {
            if ($scope.imgsrc[i] != undefined && $scope.imgsrc[i].showIcons) {

                $scope.imgsrc[i].showIcons = false;

            }
        }

    }

    function restorePreviousValues() {
        var i = 0;

        var length = $scope.contentObj.contentAsGrid.length;
        for (i; i < length; i++) {
            if ($scope.contentObj.contentAsGrid[i].valueChange) {

                $scope.contentObj.contentAsGrid[i].valueChange = false;


            }
        }


    }
    $scope.contentObj.editContentCustomizeBranding = function (object, value) {


        var url = getURL(object._links, "updateContentValue");
        var requestObject = {
            value: value,
            status: "Published"
        };


        apiService._put($http, url,
       requestObject, {
           "Authorization": _token,
           "Content-type": "application/json"
       })
            .then(function (response) {
                var updatedObject = response.data.data;
                updateContentGroupsArray($scope.contentObj.content, updatedObject);
                refreshPreviousContent(updatedObject);
                if (!isValueUpdated()) {

                    restorePreviousValues();
                }
                var index = getObjectIndex($scope.contentObj.contentAsGrid, object);
                if (index != -1) {
                    $scope.contentObj.contentAsGrid[index].valueChange = false;
                    $scope.contentObj.contentAsGrid[index].showIcons = false;

                }
                $scope.newContent.valueChange = false;
                if ($scope.imgsrc[object.id] != undefined) {

                    $scope.imgsrc[object.id].showIcons = false;
                    $scope.imgsrc[object.id].isPropertySaved = true;
                    $timeout(function () {
                        $scope.imgsrc[object.id].isPropertySaved = false;
                    }, 2000);
                } else {

                    $scope.isPropertySaved = true;


                }

                $timeout(function () {
                    $scope.isPropertySaved = false;
                }, 2000);
               
            },
            function (error) {

                if ($scope.imgsrc[object.id] != undefined) {

                    $scope.imgsrc[object.id].isAlreadyExist = true;
                    $scope.imgsrc[object.id].errorDescription = (typeof error.data.fields !== "undefined") ? error.data.fields.value.toString() : error.description.toString();


                    $timeout(function () {
                        $scope.imgsrc[object.id].isAlreadyExist = false;

                    }, 2000);
                }

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
        apiService._put($http, url,
         requestObject, {
             "Authorization": _token,
             "Content-type": "application/json"
         })
        .then(function (response) {
           
            var updatedObject = response.data.data;
            updateContentGroupsArray($scope.contentObj.content, updatedObject);
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
        });

    }
    function UpdateContentArray(currentData) {
        var i = 0;
        var length = $scope.contentObj.content.length;
        for (i; i < length; i++) {
            if ($scope.contentObj.content[i].id == currentData.ID) {
                $scope.contentObj.content[i].name = currentData.name;
                $scope.contentObj.content[i].value = currentData.value;
            }
        }
    }
    function UpdateContentValueArray(currentData) {
        var i = 0;
        var length = $scope.contentObj.content.length;

        for (i; i < length; i++) {
            if ($scope.contentObj.content[i].id == currentData.ID) {

                $scope.contentObj.content[i].value = currentData.value;
            }
        }
    }
  

    $scope.editContextMenu = function (url, rel) {
        var requestValue;
        if (rel == "inheritContentValue") requestValue = null;
        if (rel == "clearContentValue") requestValue = "";


        var requestObject =
            {
                value: requestValue,
                status: "Published"
            };
        apiService._put($http, url,
      requestObject, {
          "Authorization": _token,
          "Content-type": "application/json"
      })
           .then(function (response) {
                
               var updatedObject = response.data.data;
               updateContentGroupsArray($scope.contentObj.content, updatedObject);

               $scope.isSuccess = true;
               if (rel == "inheritContentValue") {
                   refreshPreviousContent(updatedObject);
                   $scope.successMessage = "Inherited Successfully"
               }
               else if (rel == "clearContentValue") {
                   $scope.successMessage = "Cleared Successfully"
               }

               $timeout(function () {
                   $scope.isSuccess = false;

               }, 2000);
           },
           function (error) {

           });
    };
    function refreshPreviousContent(newObject) {
        var updatedNodes = [];
        updatedNodes[0] = newObject;
        update_brandingContent.updateSectionValues(true);
        update_brandingContent.set_branding(updatedNodes);

    }
    function updateContentGroupsArray(contentArray, newObject) {

        var i = 0;

        var length = contentArray.length;
        for (i; i < length; i++) {

            if (newObject.id === contentArray[i].id) {
                contentArray[i] = newObject;
                break;
            }
        }

        $scope.contentObj.contentAsList = getContentAsList($scope.contentObj.content);
        $scope.contentObj.contentAsGrid = getContentAsGrid($scope.contentObj.content);

    }
});