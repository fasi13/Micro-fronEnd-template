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

        
        var hc = this;
        hc.isCollapsed = true;
        
        var content = JSON.parse(sessionStorage.getItem("_contentManagement"));

        
        angular.forEach(content._links, function (appGroupValue, key) {
            if (appGroupValue.rel == "applicationGroups") {
                $scope.hirerachy = {
                    items: []
                };
                var _token = JSON.parse($cookies.get('profile'))._token;
              
                var test = new service($http, appGroupValue.href)._get(_token)
                           .then(function (response) {
                               $scope.hirerachy.tempItem = response.data.data.items;
                               angular.forEach($scope.hirerachy.tempItem, function (applications, key) {
                                   $scope.hirerachy.name = applications.name;
                                   angular.forEach(applications._links, function (value, key) {
                                       if (value.rel == "applications") {
                                           
                                           apiService.get(value.href,
                                           HierarchyLoadCompleted,
                                           HierarchyLoadFailed, _token);

                                       }
                                   })
                               });
                           });

            }

            
        });

        function HierarchyLoadCompleted(result) {
               
                if (result.status == 200) {
                    self.data = tree.genNode(result.data.data.items, null, true);
                  
                } else {
                    $window.alert('Hierarchy load failed' + result.error);
                }

            }

        function HierarchyLoadFailed(result) {
            $window.alert('Hierarchy load failed');
            }

        self.showTree = true;
       
        //$log.info('heirachy connected');
    }; //controller;
    angular
        .module('app_heirarchy', ["treeModule"])
        .config(function (ivhTreeviewOptionsProvider) {
            ivhTreeviewOptionsProvider.set({
                twistieCollapsedTpl: '<leaf>  <span class="glyphicon glyphicon-plus"></span> </leaf> ',
                twistieExpandedTpl: '<leaf> <span class="glyphicon glyphicon-minus"></span></leaf>',
                twistieLeafTpl: '<leaf><span class="glyphicon glyphicon-refresh load"></span></leaf>'

            })
        })
        .component('heirarchyComponent', {
            templateUrl: 'apps/views/heirarchy-component.html',
            controller: ['$log', 'serviceEndpoint', '$http', '$cookies', '$scope','apiService','$window', 'tree',  controller],
            controllerAs: 'hc'
        });

})();