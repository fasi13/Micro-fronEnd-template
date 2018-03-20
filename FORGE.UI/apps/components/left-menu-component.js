(function () {
    'use strict';

    function controller($scope, $log, $state, $rootScope, $cookies, apiService, update_breadcrumbs, updateContentGroup) {
        var lm = this;
        
        lm.status = {
            isDashboard :false,
            isContentMgmt: false,
            isPromotion: false,
            isSetting:false,
        };
        $scope.lmc = {};

        var _token = JSON.parse($cookies.get('profile'))._token;
        $scope.lmc.loadContentGroups = function () {
            
            $scope.lmc.clickedNode = update_breadcrumbs.configuredNode._links;

            if ($scope.lmc.clickedNode != null && IsContentGroupExist($scope.lmc.clickedNode)) {

                $scope.lmc.contentGroupsList = [];
                $scope.lmc.dataTypeURL = getdataTypeURL($scope.lmc.clickedNode);



                for (var i = 0; i < $scope.lmc.clickedNode.length; i++) {

                    if ($scope.lmc.clickedNode[i].rel == "contentGroups") {

                        apiService.get($scope.lmc.clickedNode[i].href + "?content=false",
                                                                  contentGroupsLoadSuccessfully,
                                                                contentGroupsLoadFailed, _token);

                        break;
                    }
                }

            }

        }


        function getdataTypeURL(links) {
            for (var i = 0; i < links.length; i++) {

                if (links[i].rel == "self") {

                    return links[i].href + "/dataTypes";
                }
            }

        }

        function IsContentGroupExist(links) {
            for (var i = 0; i < links.length; i++) {

                if (links[i].rel == "contents" || links[i].rel == "contentGroups") {

                    return true;
                }
            }
        }

        $scope.lmc.loadContents = function (content) {
            
            $scope.lmc.contentName = content.name;
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

        function contentLoadFailed(data) {

            console.log(data);
        }

        function contentLoadSuccessfully(response) {
            
            $scope.lmc.contents = response.data.data;
           
            $scope.lmc.contents.dataTypeURL = $scope.lmc.dataTypeURL;
            
            $state.go("dashboard.content-view", { obj: JSON.stringify($scope.lmc.contents), name: $scope.lmc.contentName});


        }


        $scope.$on("contentGroupsChanged", function () {
            if (updateContentGroup.isAdd)
            {
                $scope.lmc.contentGroupsList.items.push(updateContentGroup.contentGroup);
            }
            else if (updateContentGroup.isAdd == false)
            {
                UpdateContentMangementLeftMenuArray(updateContentGroup.contentGroup);
            }
           


        });
        function UpdateContentMangementLeftMenuArray(currentData) {
            debugger;
            for (var i = 0; i < $scope.lmc.contentGroupsList.items.length; i++) {
                if ($scope.lmc.contentGroupsList.items[i].id == currentData.ID) {

                    $scope.lmc.contentGroupsList.items[i].name = currentData.name;
                    $scope.lmc.contentGroupsList.items[i].value = currentData.value;
                }
            }
        }
        function contentGroupsLoadSuccessfully(result) {


 
                $scope.lmc.contentGroupsList = result.data.data;

                $state.go('dashboard.content-management', { obj: $scope.lmc.contentGroupsList, dataTypeURL:$scope.lmc.dataTypeURL });





        }

        function contentGroupsLoadFailed(result) {
            console.log(result);
        }

        lm.$onInit = function () {
            lm.status.isContentMgmt = true;
        }

        lm.goTo = function (site) {

            
            $state.go(site);
        };

       
    }; //controller



    angular
       .module('app_leftMenuComponent',[])
       .component('leftMenuComponent', {
           templateUrl: 'apps/views/left-menu-component.html',
           controller: ['$scope','$log', '$state', '$rootScope','$cookies', 'apiService', 'update_breadcrumbs','updateContentGroup', controller],
           controllerAs: 'lm',
           bindings: {
               navLinks: '<',
               access: '<'
           }
       });
})();
