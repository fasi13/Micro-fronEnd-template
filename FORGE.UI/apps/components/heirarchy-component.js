
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
            }
        }
    };
    var setHeirarchy = function (hirerachy) {
    };
    function controller($log, serviceEndpoint, $http, $cookies, $scope, apiService, $window, tree, update_breadcrumbs, share_parent) {
        var self = this;
        self.data = [];
        $scope.bread_text = [];

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
                $scope.brdcrm = { 'user': result.data.data.name };
            } else {
                $window.alert('Hierarchy load failed' + result.error);
            }

        }

        function HierarchyLoadFailed(result) {
            $window.alert('Hierarchy load failed');
        }






        self.showTree = true;



        $scope.$on('breadcrumbsChanged', function () {

            $scope.clicked_node = update_breadcrumbs.node;
            $scope.parent = update_breadcrumbs.parent;



        });




        $scope.config_breadcrumb = function () {


            var start_node = $scope.parent[0];
            $scope.bread_text = [];

            $scope.brdcrm = { 'user': start_node.label, 'unique': start_node.unique };


            if ($scope.clicked_node.parent != null && $scope.clicked_node.parent.unique == start_node.unique) {
                $scope.bread_text.unshift($scope.clicked_node);
            }
            if ($scope.clicked_node.unique != start_node.unique && $scope.clicked_node.parent.unique != start_node.unique) {
                $scope.bread_text.unshift($scope.clicked_node);
                $scope.bread_text.unshift($scope.clicked_node.parent);
            }

        }


        $scope.show_node = function (id) {


            if ($scope.bread_text.length > 0) {

                if (id == $scope.brdcrm.unique) {

                    if ($scope.bread_text.length == 2) {
                        $scope.bread_text.pop();
                        $scope.bread_text.pop();
                    }
                    if ($scope.bread_text.length == 1) {
                        $scope.bread_text.pop();
                    }
                }
                else {
                    if ($scope.bread_text.length == 2 && $scope.bread_text[1].unique != id) {
                        $scope.bread_text.pop();

                    }
                }
            }

            var el = document.getElementById(id);
            if (angular.element(el).hasClass('ivh-treeview-node')) {
                angular.element(el).removeClass('ivh-treeview-node');
                angular.element(el).removeClass('ivh-treeview-node-collapsed');
            }
            else {

                angular.element(el).addClass('ivh-treeview-node');
                angular.element(el).addClass('ivh-treeview-node-collapsed');
            }

        }

        //$log.info('heirachy connected');
    }; //controller;
    angular
        .module('app_heirarchy', ["treeModule"])
        .config(function (ivhTreeviewOptionsProvider) {
            ivhTreeviewOptionsProvider.set({
                twistieCollapsedTpl: '<span class="glyphicon glyphicon-plus"></span>',
                twistieExpandedTpl: '<span class="glyphicon glyphicon-minus"></span>',
                twistieLeafTpl: '<span class="glyphicon glyphicon-refresh load"></span>'

            })
        })
        .component('heirarchyComponent', {
            templateUrl: 'apps/views/heirarchy-component.html',
            controller: ['$log', 'serviceEndpoint', '$http', '$cookies', '$scope', 'apiService', '$window', 'tree', 'update_breadcrumbs', 'share_parent', controller],
            controllerAs: 'hc'
        });

})();