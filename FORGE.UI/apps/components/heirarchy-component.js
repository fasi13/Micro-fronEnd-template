
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

    function controller($log, serviceEndpoint, $http, $cookies, $scope, apiService, $window, tree, update_breadcrumbs, share_parent, $timeout) {
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

                $scope.brdcrm = { 'user': result.data.data.name, 'unique': self.data[0].unique };
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
        function updateSelectedNode(uniqueId) {

            angular.element('.ivh-treeview-node-label').removeClass("selected");
            var el = document.getElementById(uniqueId);
            var span = angular.element(el).find("span");

            for (var i = 0; i < span.length; i++) {
                if (angular.element(span[i]).hasClass('ivh-treeview-node-label')) {
                    angular.element(span[i]).addClass("selected");
                    break;
                }
            }
        }
        $scope.config_breadcrumb = function (currentNode) {
            if (currentNode != undefined) {
                $scope.clicked_node = currentNode;
            }
            if ($scope.clicked_node.IsApplicationGroup) {
                return;
            }
            else {
                $scope.iterateCount = 0;
                $scope.bread_text = [];
                $scope.hover_brdcm = "";
                var start_node = $scope.parent[0];
                CreateBreadcrumb($scope.clicked_node, start_node);
                CreateBreadcrumbForHover($scope.clicked_node, start_node);
                hc.isCollapsed = true;
            }

        }
        function IsNodeExist(obj, list) {
            if (obj == undefined) {
                return;
            } for (var i = 0; i < list.length; i++) {
                if (list[i].unique === obj.unique) {
                    return;
                }
            }

            return true;
        }
        function CreateBreadcrumb(node, parent) {
            if (node.id == parent.id) {
                if ($scope.bread_text.length == 0) {

                    $scope.main_parent = undefined;
                }
                if (IsNodeExist($scope.main_parent, $scope.bread_text)) {
                    $scope.bread_text.unshift($scope.main_parent);
                }
                if ($scope.bread_text.length == 0 || IsNodeExist(node, $scope.bread_text)) {

                    $scope.bread_text.unshift(node);
                }

                return;

            }
            else {
                $scope.breadCrumb = [];
                getApplications(node, parent);


                for (var i = 0; i < $scope.breadCrumb.length; i++) {

                    if (i == 2) {

                        for (var j = $scope.breadCrumb.length - 2; i > 0; (i-- && j++)) {
                            if (IsNodeExist($scope.breadCrumb[j], $scope.bread_text)) {
                                $scope.bread_text.push($scope.breadCrumb[j]);
                            }
                        }
                        break;
                    }
                    else {
                        $scope.bread_text.push($scope.breadCrumb[i]);
                    }

                }
            }

        }

        function getApplications(node, parent) {

            if (!node.IsApplicationGroup) {

                $scope.breadCrumb.unshift(node);
                if (node.id == parent.id) {
                    return;
                }
            }
            $scope.iterateCount++;
            getApplications(node.parent, parent);

        }

        function CreateBreadcrumbForHover(node, parent) {
            if (node.id == parent.id && !node.IsApplicationGroup) {
                $scope.hover_brdcm = node.label + " / " + $scope.hover_brdcm;
                return;
            }
            else {
                if ($scope.hover_brdcm.length == 0) {
                    if (!node.IsApplicationGroup) {
                        $scope.hover_brdcm = node.label;
                    }
                }
                else {
                    if (!node.IsApplicationGroup) {
                        $scope.hover_brdcm = node.label + " / " + $scope.hover_brdcm;
                    }
                }
                CreateBreadcrumbForHover(node.parent, parent);
            }

        }
        $scope.toggleRootNode = function (uniqueId) {
            var rootElement = document.getElementById(uniqueId);
            var rootElementSpan = angular.element(rootElement).find("span");
            $timeout(function () {
                angular.element(rootElementSpan[0]).triggerHandler('click');
            });

        }

        $scope.toggleBreadCrumb = function (node) {
            if ($scope.bread_text.length > 0) {
                toggleNodes(node);
                if (node.unique != $scope.bread_text[$scope.bread_text.length - 1].unique) {
                    $scope.config_breadcrumb(node);
                }
            }
        }
        function toggleNodes(node) {
            updateSelectedNode(node.unique);
            var el = document.getElementById(node.unique);
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
            controller: ['$log', 'serviceEndpoint', '$http', '$cookies', '$scope', 'apiService', '$window', 'tree', 'update_breadcrumbs', 'share_parent', '$timeout', controller],
            controllerAs: 'hc'
        });

})();