
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
    function controller($log, serviceEndpoint, $http, $cookies, $scope, apiService, $window, tree, $timeout) {
        var self = this;
        self.data = [];


        var hc = this;
        hc.isCollapsed = true;

        var baseApplicationUrl = JSON.parse(sessionStorage.getItem("baseApplicationUrl"));



        var _token = JSON.parse($cookies.get('profile'))._token;

        apiService.get(baseApplicationUrl,
                                 HierarchyLoadCompleted,
                                 HierarchyLoadFailed, _token);




        function HierarchyLoadCompleted(result) {

            if (result.status == 200) {
                self.data = tree.genNode(result.data.data, null, true);

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
        .module('app_heirarchy', ["treeModule", 'ui.bootstrap'])
        .config(function (ivhTreeviewOptionsProvider) {
            ivhTreeviewOptionsProvider.set({
                twistieCollapsedTpl: '<span class="glyphicon glyphicon-plus"></span>',
                twistieExpandedTpl: '<span class="glyphicon glyphicon-minus"></span>',
                twistieLeafTpl: '<span class="glyphicon glyphicon-refresh load"></span>'

            })
        })
        .component('heirarchyComponent', {
            templateUrl: 'apps/views/heirarchy-component.html',
            controller: ['$log', 'serviceEndpoint', '$http', '$cookies', '$scope', 'apiService', '$window', 'tree', '$timeout', controller],
            controllerAs: 'hc'
        });

})();