
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

    function controller($log, serviceEndpoint, $http, $cookies, $scope, apiService, $window, tree, update_breadcrumbs, update_brandingContent, share_parent, $timeout) {
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


        $scope.hierarchyRightContent = {
            PrimaryColor: "",
            SecondaryColor: "",
            CreditUnionLogo: "",
            CreditUnionName: "",
            CreditUnionURL: "",
            CustomerServiceNumber: ""

        };

        function HierarchyLoadCompleted(result) {

            if (result.status == 200) {

                self.data = tree.genNode(result.data.data, null, true);
                $scope.root = self.data[0];

                updateSelectedNode($scope.root.unique);
                $scope.clicked_node = $scope.root; // for branding content
                $scope.config_breadcrumb($scope.root);
                $scope.toggleRootNode($scope.root.unique);
                $scope.brdcrm = { 'user': $scope.root.label, 'unique': $scope.root.unique };
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
        $scope.$on('CreateHierarchyRightContent', function () {

            angular.forEach(update_brandingContent.node, function (attributeVal, attributeKey) {
                if (attributeVal.name == "Primary Color") {
                    var color = attributeVal.value;
                    if (color.charAt(0) == "#") {
                        $scope.hierarchyRightContentPrimaryColor = color;
                    }
                    else {
                        $scope.hierarchyRightContentPrimaryColor = "#" + color;
                    }

                }
                if (attributeVal.name == "Secondary Color") {
                    var color = attributeVal.value;
                    if (color.charAt(0) == "#") {
                        $scope.hierarchyRightContentSecondaryColor = color;
                    }
                    else {
                        $scope.hierarchyRightContentSecondaryColor = "#" + color;
                    }

                }
                if (attributeVal.name == "Customer Service Phone Number") {
                    $scope.hierarchyRightContentCustomerServiceNumber = attributeVal.value;
                }
                if (attributeVal.name == "Primary Logo") {
                    $scope.hierarchyRightContentCreditUnionLogo = attributeVal.value;
                }
                if (attributeVal.name == "Site URL") {
                    $scope.hierarchyRightContentCreditUnionURL = attributeVal.value;
                }

                $scope.hierarchyRightContentCreditUnionName = $scope.clicked_node.label;
                isColorFilled();

            });

        });

        function isColorFilled() {
            if ($scope.hierarchyRightContentSecondaryColor == null || $scope.hierarchyRightContentPrimaryColor == null) {
                $timeout(function () { isColorFilled(); }, 0);
            }
            else {
                less.modifyVars({ color1: $scope.hierarchyRightContentPrimaryColor, color2: $scope.hierarchyRightContentSecondaryColor });
            }
        }

        function updateSelectedNode(uniqueId) {
            var el = document.getElementById(uniqueId);
            if (el == null) {
                $timeout(function () {
                    updateSelectedNode(uniqueId);
                }, 0);
            }
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
        function HierarchyBrandingAttributesLoadCompleted(result) {

            if (result.status == 200) {

                $scope.value = result.data.data.items[0].value;


            } else {
                $window.alert('Branding Contents load failed' + result.error);
            }

        }

        function HierarchyBrandingAttributesLoadFailed(result) {
            $window.alert('Branding Contents load failed');
        }
        function CreateHierarchyRightContent(contentURL) {


            getHierarchyBrandingAttributes(contentURL, "Primary Color"),
            getHierarchyBrandingAttributes(contentURL, "Secondary Color"),
            getHierarchyBrandingAttributes(contentURL, "Customer Service Phone Number"),
            getHierarchyBrandingAttributes(contentURL, "Primary Logo"),
            getHierarchyBrandingAttributes(contentURL, "Site URL");


        }
        function getHierarchyBrandingAttributes(contentURL, attribute) {

            var getAttributeURL = contentURL + "?name=" + attribute + "&exactMatch=true";
            var value;
            apiService.getBrandingData(getAttributeURL, _token).then(function (brandingData) {
                value = update_brandingContent.set_branding(brandingData);

            });

        }
        function temporarilyNavigateToContentManagement() {

            var rootElement = document.getElementById("contentManagementSection");

            $timeout(function () {
                angular.element(rootElement).triggerHandler('click');
            });

        }

        $scope.config_breadcrumb = function (currentNode) {

            // Get branding....
            angular.forEach($scope.clicked_node._links, function (linksVal, linksKey) {
                if (linksVal.rel == "contents") {
                    CreateHierarchyRightContent(linksVal.href);
                }
            });

            if (currentNode != undefined) {
                update_breadcrumbs.configNode(currentNode);
                $scope.clicked_node = currentNode;
                update_breadcrumbs.node = currentNode;
            }
            if ($scope.clicked_node.IsApplicationGroup) {
                return;
            }
            else {
                update_breadcrumbs.configNode($scope.clicked_node);
                $scope.iterateCount = 0;
                $scope.bread_text = [];
                $scope.hover_brdcm = "";
                var start_node = $scope.root;

                CreateBreadcrumb($scope.clicked_node, start_node);
                CreateBreadcrumbForHover($scope.clicked_node, start_node);
                hc.isCollapsed = true;
            }
            temporarilyNavigateToContentManagement();

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

            if (rootElement == null) {
                $timeout(function () {
                    $scope.toggleRootNode(uniqueId);
                }, 0);

            }

            var rootElementSpan = angular.element(rootElement).find("span");
            $timeout(function () {
                angular.element(rootElementSpan[0]).triggerHandler('click');
            });

        }

        $scope.toggleBreadCrumb = function (node) {
            if ($scope.bread_text.length > 0) {
                toggleNodes(node);
                if (node.unique != $scope.bread_text[$scope.bread_text.length - 1].unique) {
                    $scope.clicked_node = node; // for branding content
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
            controller: ['$log', 'serviceEndpoint', '$http', '$cookies', '$scope', 'apiService', '$window', 'tree', 'update_breadcrumbs', 'update_brandingContent', 'share_parent', '$timeout', controller],
            controllerAs: 'hc'
        });

})();
