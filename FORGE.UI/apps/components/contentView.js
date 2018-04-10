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




.controller("contentView", function ($scope, $state, $stateParams, $cookies, $http, $timeout, apiService) {


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

       

        for (var i = 0; i <obj.length; i++) {

           
                for (var j = 0; j < $scope.copyContent.length; j++) {

                    if (obj[i] == undefined){
                        break;
                    }
                     if(obj[i].id == $scope.copyContent[j].id) {
                         obj[i].name = $scope.copyContent[j].name;
                        obj[i].value = $scope.copyContent[j].value;
                        $scope.newContent.showIcons = false;
                        if (obj[i].showIcons !== undefined) {

                            obj[i].showIcons = false;
                            obj[i].filename = "";
                        }
                        break;

                    }

            }
        }

    }
    $scope.contentObj.getValue = function (value, obj) {

        if (!$scope.newContent.showIcons) {
            $scope.copyContent.push({ id: angular.copy(obj.id), value: angular.copy(value),name:angular.copy(obj.name) })


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
            debugger;
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

    $scope.documentUpload = function (element) {

        var files = element.files;
        $scope.file = files[0];
        debugger;
        var ext = $scope.file.name.substr($scope.file.name.lastIndexOf('.') + 1);


      

        if (ext == "pdf") {
            if (element.attributes.documentID != undefined) {
                debugger;
                $scope.documentID = element.attributes.documentID.value;
                $scope.imgsrc[$scope.documentID] = {};
            }
            else {
                $scope.newContent.Value = $scope.file.name;
            }
            var reader = new FileReader();
            reader.readAsDataURL($scope.file);
            reader.addEventListener("loadend", function (e) {

               
                $scope.documentBase64 = $scope.file.name + ":" + e.target.result.split(',')[1];


                $scope.$apply(function () {
                    var fileObject = { id: $scope.documentID, filename: $scope.file.name, value: e.target.result ,showIcons:true};
                   
                    $scope.imgsrc[$scope.documentID] = fileObject;
                });


            });

        }
        else {
         
            $scope.documentID = element.attributes.documentID.value;
            $scope.imgsrc[$scope.documentID].isValidExtension = true;
            $scope.$apply();
            $timeout(function () {
                $scope.imgsrc[$scope.documentID].isValidExtension = false;
            }, 2000);
        }

    }



    function validateImageExtension(fld) {
        if (!/(\png|\jpg|\jpeg)$/i.test(fld)) {
            return false;
        }
        else
            return true;
    }

    $scope.imageUpload = function (element) {

        var files = element.files;
        $scope.file = files[0];
        
       
        var ext = $scope.file.name.substr($scope.file.name.lastIndexOf('.') + 1);

       
        if (validateImageExtension(ext)) {

          
            if (element.attributes.imgObject != undefined) {

                var imgObject = JSON.parse(element.attributes.imgObject.value);
                $scope.imgsrc[imgObject.id] = {};
                $scope.imgObject = imgObject.id;
            }
            else {
                $scope.newContent.value = $scope.file.name;

            }




            var reader = new FileReader();

            reader.readAsDataURL($scope.file);
            reader.onloadend = function (e) {
                
                $scope.imageBase64 = $scope.file.name + ":" + e.target.result.split(',')[1];
                $scope.$apply(function () {

                    $scope.modalImgsrc = "";
                    $scope.modalImgsrc = e.target.result;
                    $scope.newContent.dataURL = e.target.result;
                   
                    if (element.attributes.imgObject != undefined) {
                        
                        var imgObject = { id:$scope.imgObject,filename: $scope.file.name, value: e.target.result , showIcons:true};
                        $scope.imgsrc[$scope.imgObject] = imgObject;
                    }
                });

            };

        




        }
        else {
           
            
            $scope.imgsrc[$scope.imgObject].isValidExtension = true;
            $scope.$apply();
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
        $scope.newContent.value = result.data.data.value;
        $scope.currentContent = result.data.data;


    }

    function ContentValueLoadFailed(error) {
       
        console.log(error);

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


    window.onload = function (e) {
        $('#form').data('serialize', $('#form').serialize()); // On load save form current state
        console.log($('form').data('serialize'));
        $(window).bind('beforeunload', function (e) {
            if ($('#form').serialize() != $('#form').data('serialize')) return "Changes you made may not be saved.";
            // i.e; if form state change show warning box, else don't show it.
        });
    };

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
       
        debugger;
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
               
                console.log(response);
                if ($scope.imgsrc[object.id] != undefined) {
                    $scope.imgsrc[object.id].showIcons = false;
                    $scope.imgsrc[object.id].isPropertySaved = true;
                    $timeout(function () {
                        $scope.imgsrc[object.id].isPropertySaved = false;
                    }, 2000);
                }
                $scope.isPropertySaved = true;
                $scope.newContent.showIcons = false;
               
                $timeout(function () {
                    $scope.isPropertySaved = false;
                }, 2000);
            },
            function (error) {
                
                if ($scope.imgsrc[object.id] != undefined) {
                    
                    $scope.imgsrc[object.id].isAlreadyExist = true;
                    $scope.imgsrc[object.id].errorDescription = (typeof error.data.fields !=="undefined") ? error.data.fields.value.toString() : error.description.toString();


                    $timeout(function () {
                        $scope.imgsrc[object.id].isAlreadyExist = false;

                    }, 2000);
                }
                debugger;
                console.log(error);

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