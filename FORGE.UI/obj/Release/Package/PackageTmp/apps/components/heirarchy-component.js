(function () {
    'use strict';
    var service = function ($http, APIEndpoint) {
        return {
            _get: function (t) {
                return $http({
                    method: 'GET',
                    url: APIEndpoint,
                    headers: {
                        'Authorization': t,
                    }
                });
            } //auth fn
        }//return
    };
    var setHeirarchy = function (hirerachy) {
    };
    function controller($log, serviceEndpoint, $http, $cookies, $scope, apiService, $window, tree) {
        var self = this;
        self.data = [];
        $scope.IsVisible = false;
        $scope.IsSecondVisible = false;
        // code addition next 2 lines
      

        $scope.ShowHide = function () {
            $scope.IsVisible = $scope.IsVisible ? false : true;
        };
        $scope.ShowHide1 = function () {
            $scope.IsSecondVisible = $scope.IsSecondVisible ? false : true;
        };
        
        var content = JSON.parse(sessionStorage.getItem("_contentManagement"));

        //console.log(content);
    
        
        // old code edit 02/02/18
                $scope.hirerachy = {
                    items: []
                };
      


            var _token = JSON.parse($cookies.get('profile'))._token;

            var test = new service($http, content._links[2].href)._get(_token)
                      .then(function (response) {
                          $scope.hirerachy.tempItem = response.data.data.items;
                          console.log(response.data.data.items);
                          apiService.get(response.data.data.items[0]._links[1].href,
                                        CategoryLoadCompleted,
                                        CategoryLoadFailed);

                      });
       
        //    var test = new service($http, appGroupValue.href)._get(_token)
        //               .then(function (response) {
        //                   $scope.hirerachy.tempItem = response.data.data.items;
        //                   angular.forEach($scope.hirerachy.tempItem, function (applications, key) {
        //                       $scope.hirerachy.name = applications.name;
        //                       angular.forEach(applications._links, function (value, key) {
        //                           if (value.rel == "applications") {
        //                               new service($http, value.href)._get(_token)
        //                               .then(function (response) {
        //                                   $scope.hirerachy.items.push(response.data.data.items);
        //                                   console.log("abcd.." + response.data.data.items);

        //                                   angular.forEach($scope.hirerachy.tempItem, function (applications, key) {
        //                                       $scope.hirerachy.name = applications.name;
        //                                       angular.forEach(applications._links, function (value, key) {
        //                                           if (value.rel == "applications") {
        //                                               new service($http, value.href)._get(_token)
        //                                               .then(function (response) {
        //                                                   $scope.hirerachy.items.push(response.data.data.items);

        //                                               })
        //                                           }
        //                                       })
        //                                   })
        //                               })
        //                           }
        //                       })
        //                   })
        //               });
        //});
            //   console.log($scope.hirerachy);


            //Simulate parameter needed to pass to server


            // https://i3services-qa.hinda.com/forge/application/1/applicationGroup/2/applications
            //Call server to get data
            //https://i3services-qa.hinda.com/forge/application/1/applicationGroup/2/applications
            //apiService.get(content._links[2].href,
            //  CategoryLoadCompleted,
            //  CategoryLoadFailed);

            function CategoryLoadCompleted(result) {
                // debugger;
                if (result.status == 200) {
                    self.data = tree.genNode(result.data.data.items, null, true);
                    console.log(self.data);
                } else {
                    $window.alert('Category loaded failed' + result.error);
                }

            }

            function CategoryLoadFailed(result) {
                $window.alert('Category loaded failed');
            }



        //                       angular.forEach($scope.hirerachy.tempItem, function (applications, key) {
        //                           $scope.hirerachy.name = applications.name;
        //                           angular.forEach(applications._links, function (value, key) {
        //                               if (value.rel == "applications") {
        //                                   new service($http, value.href)._get(_token)
        //                                   .then(function (response) {
        //                                       $scope.hirerachy.items.push(response.data.data.items);


        //                                       for (var i = 0; i < $scope.hirerachy.items.length; i++) {
        //                                           $scope.tempI = i;
        //                                           var hierarchyItemLinks = $scope.hirerachy.items[i][i]._links;
        //                                           angular.forEach(hierarchyItemLinks, function (link, linkKey) {
        //                                               if (link.rel == "applicationGroups") {
        //                                                   new service($http, link.href)._get(_token)
        //                                                   .then(function (response) {
        //                                                       $scope.hirerachy.items[$scope.tempI][$scope.tempI]._links = response.data.data.items;

        //                                                       for (var j = 0; j < $scope.hirerachy.items[$scope.tempI][$scope.tempI]._links.length; j++) {
        //                                                           $scope.tempJ = j;
        //                                                           //var ChildItemLinks = $scope.hirerachy.items[$scope.tempI][$scope.tempI]._links[$scope.tempJ]._links;
        //                                                           angular.forEach($scope.hirerachy.items[$scope.tempI][$scope.tempI]._links[$scope.tempJ]._links, function (childNodeLink, childNodeKey) {
        //                                                               if (childNodeLink.rel == "applications") {
        //                                                                   new service($http, childNodeLink.href)._get(_token)
        //                                                                    .then(function (childNodeResponse) {
        //                                                                        $scope.hirerachy.items[$scope.tempI][$scope.tempI]._links[$scope.tempJ]._links = childNodeResponse.data.data.items;
        //                                                                    });
        //                                                               }
        //                                                           });
        //                                                       }
        //                                                   });
        //                                               }
        //                                           });
        //                                           // });
        //                                       }
        //                                   });
        //                               }
        //                           });
        //                       });
        //                   });
        //    }
        //});





             //   debugger;
                self.showTree = true;


        //$log.info('heirachy connected');
    }; //controller;
    angular
        .module('app_heirarchy', ["treeModule"])
        .config(function (ivhTreeviewOptionsProvider) {
            ivhTreeviewOptionsProvider.set({
                twistieCollapsedTpl: '<leaf><i class="fa fa-plus"></i></leaf> ',
                twistieExpandedTpl: '<leaf><i class="fa fa-minus"></i></leaf>',
                twistieLeafTpl: '<leaf><i class="fa fa-refresh"></i></leaf>'

            })
        })
        .component('heirarchyComponent', {
            templateUrl: 'apps/views/heirarchy-component.html',
            controller: ['$log', 'serviceEndpoint', '$http', '$cookies', '$scope','apiService','$window', 'tree',  controller],
            controllerAs: 'hc'
        });

})();