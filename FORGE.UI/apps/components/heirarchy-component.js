
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

    function controller($log, serviceEndpoint, $http, $cookies, $scope, apiService, $window, tree, update_breadcrumbs, share_parent) {
        var self = this;
        self.data = [];
        $scope.parent = [];
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
            $scope.bread_text = [];
            $scope.hover_brdcm = "";
            var start_node = $scope.parent[0];

            create_brdcm($scope.clicked_node, start_node);

            create_brdcm_hover($scope.clicked_node, start_node);
            hc.isCollapsed = true;

        }

        function check_rel_app(node) {
            var rel_found = false;

            for (var i = 0; i < node.length; i++) {

                if (node[i].rel == "applicationGroups") {

                    rel_found = true;
                    break;
                }
            }
            return rel_found;
        }

        function parent_exist(node) {

            if (node == null) {
                return false;
            }
            else
                return true;
        }

        function containsObjectNot(obj, list) {
            var i;
            if (obj == undefined) {
                return false;
            } for (i = 0; i < list.length; i++) {
                if (list[i].unique === obj.unique) {
                    return false;
                }
            }

            return true;
        }
        function create_brdcm(node, parent) {


            if (node.id == parent.id) {
                if (containsObjectNot($scope.main_parent, $scope.bread_text)) {
                    $scope.bread_text.unshift($scope.main_parent);
                }
                if ($scope.bread_text.length == 0 || containsObjectNot(node, $scope.bread_text)) {

                    $scope.bread_text.unshift(node);
                }

                return;

            }
            else {
                if (node.unique == $scope.clicked_node.unique)

                    if (check_rel_app(node._links)) {

                        $scope.bread_text.unshift(node);

                        if (node.parent != null && parent_exist(node.parent.parent)) {
                            $scope.bread_text.unshift(node.parent.parent);

                        }
                        else {
                            return;
                        }
                    }
                    else {
                        var new_parent = node.parent;
                        if (containsObjectNot(new_parent, $scope.bread_text)) {
                            $scope.bread_text.unshift(new_parent);
                        }
                        if (new_parent.parent != null && parent_exist(new_parent.parent.parent)) {
                            $scope.bread_text.unshift(new_parent.parent.parent);

                        }
                        else {
                            return;
                        }

                    }


                if (check_rel_app(node._links)) {
                    $scope.main_parent = node;


                }

                create_brdcm(node.parent, parent);
            }

        }


        function create_brdcm_hover(node, parent) {
            if (node.id == parent.id) {

                $scope.hover_brdcm = node.label + " / " + $scope.hover_brdcm;
                return;

            }
            else {
                if ($scope.hover_brdcm.length == 0) {
                    $scope.hover_brdcm = node.label;
                }
                else
                    $scope.hover_brdcm = node.label + " / " + $scope.hover_brdcm;
                create_brdcm_hover(node.parent, parent);
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