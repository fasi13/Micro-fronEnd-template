(function () {
    'use strict';

    function controller($scope,$log, $state, $rootScope, $cookies, apiService, update_breadcrumbs) {
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
            $scope.lmc.clickedNode = update_breadcrumbs.node._links;

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

        $scope.lmc.loadContents= function (content) {
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


        function contentGroupsLoadSuccessfully(result) {


 
                $scope.lmc.contentGroupsList = result.data.data.items;

                $state.go('dashboard.content-management', { obj: $scope.lmc.contentGroupsList });





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
           controller: ['$scope','$log', '$state', '$rootScope','$cookies', 'apiService', 'update_breadcrumbs', controller],
           controllerAs: 'lm',
           bindings: {
               navLinks: '<',
               access: '<'
           }
       });
})();
