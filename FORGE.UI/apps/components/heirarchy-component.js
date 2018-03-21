
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

    function controller($log, serviceEndpoint, $http, $cookies, $scope, apiService, $window, tree, update_breadcrumbs, update_brandingContent, share_parent, $timeout, getChild) {
        var self = this;
        self.data = [];
        $scope.parent = [];
        $scope.bread_text = [];
        var hc = this;
        $scope.searchBox = {};
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

        // start of search implementation
        $scope.startSearch = function (myobj) {
            var node = hc.data[0];
            if (myobj != undefined) {
                hc.isCollapsed = false;
                $scope.requiredNode = myobj.path[myobj.path.length - 1];
                $scope.nodePath = [];
                $scope.nodePath = myobj.path;

                node.click = "autoClick";

                if (node.children.length > 1 || node.children.length == 1) {
                    node.children = [];
                    node.children.push({
                        label: 'Loading...',
                        id: 0,
                        type: 'DEL',  //Use for determine whether to load from server or delete the node
                        children: []
                    });
                }
                $scope.toggleRootNode(node.unique);



                $scope.currentNodeChild = [];

            }
        }
        function containNode(id) {
            if (id == undefined) {

                $timeout(function () {
                    containNode(id)


                }, 0);
            }
            if (id != undefined) {
                for (var i = 0; i < $scope.currentNodeChild.length; i++) {

                    if (id == $scope.currentNodeChild[i].id) {

                        return $scope.currentNodeChild[i];
                    }
                }
            }
            return false;
        }


        $scope.search = function (text) {
            $scope.text_val = text;

            if (text.length > 2) {
                apiService.get(const_APIUrl + "/applications?keyword=" + text, SearchResultSuccess, SearchResultFail, _token);
            }

        }
        function autocomplete(inp, arr) {


            /*the autocomplete function takes two arguments,
            the text field element and an array of possible autocompleted values:*/
            var currentFocus;
            /*execute a function when someone writes in the text field:*/


            var a, b, s, i, val = $scope.text_val;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false; }
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", self.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            inp.parentNode.appendChild(a);
            /*for each item in the array...*/

            if (arr.length == 0) {
                b = document.createElement("DIV");
                b.innerHTML += "<strong>No Records Found</strong>";
                a.appendChild(b);
            }
            else {
                for (i = 0; i < arr.length; i++) {

                    var name = arr[i].name;
                    var indexvalue = name.toLowerCase().indexOf(val.toLowerCase());
                    if (indexvalue !== -1) {
                        /*create a DIV element for each matching element:*/
                        b = document.createElement("DIV");
                        s = document.createElement("SPAN");
                        s.innerHTML = '<span class="seach-icon glyphicon glyphicon-search"></span>';

                        for (var j = 0; j < name.length; j++) {

                            if (j == indexvalue) {

                                b.innerHTML += "<strong>" + name.substr(j, val.length) + "</strong>";
                                j = j + (val.length - 1);
                            }
                            else {
                                b.innerHTML += name.charAt(j);
                            }

                        }
                        b.onclick = getClickedValue.bind(self, arr[i]);
                        /*execute a function when someone clicks on the item value (DIV element):*/
                        b.appendChild(s);
                        a.appendChild(b);
                    }
                }
            }
            /*execute a function presses a key on the keyboard:*/

            function closeAllLists(elmnt) {
                /*close all autocomplete lists in the document,
                except the one passed as an argument:*/
                var x = document.getElementsByClassName("autocomplete-items");
                for (var i = 0; i < x.length; i++) {
                    if (elmnt != x[i] && elmnt != inp) {
                        x[i].parentNode.removeChild(x[i]);
                    }
                }
            }
            /*execute a function when someone clicks in the document:*/
            document.addEventListener("click", function (e) {
                closeAllLists(e.target);
            });

        }



        function openNode() {

            var uniqueID = hc.data[0].unique;
            var el = document.getElementById(uniqueID);
            if (angular.element(el).hasClass('ivh-treeview-node')) {
                angular.element(el).removeClass('ivh-treeview-node');
                angular.element(el).removeClass('ivh-treeview-node-collapsed');
            }
            else {

                angular.element(el).addClass('ivh-treeview-node');
                angular.element(el).addClass('ivh-treeview-node-collapsed');

                angular.element(el).removeClass('ivh-treeview-node');
                angular.element(el).removeClass('ivh-treeview-node-collapsed');

            }

        }

        function getClickedValue(myobj) {

            $scope.searchBox.text = myobj.name;
            $scope.searchResponseObject = myobj;
            $scope.$apply();


        }

        $scope.$on('childUpdated', function () {




            $scope.currentNodeChild = getChild.child;
            for (var i = 1; i < $scope.nodePath.length; i++) {
                var appId = $scope.nodePath[i].id, appGroupId = $scope.nodePath[i].applicationGroupId;

                if (containNode(appGroupId)) {

                    var newNode = containNode(appGroupId);
                    if (newNode.IsApplicationGroup) {
                        newNode.click = "autoClick";
                        $scope.toggleRootNode(newNode.unique);

                    }
                }
                if (containNode(appId)) {

                    var newNode = containNode(appId);
                    if (!newNode.IsApplicationGroup) {
                        newNode.click = "autoClick";
                        $scope.toggleRootNode(newNode.unique);
                        openNode(hc.data[0].unique);
                        updateSelectedNode(newNode.unique);
                    }
                }


            }





        });


        function SearchResultSuccess(response) {
            var items = response.data.data.items;
            $scope.searchResult = [];


            for (var i = 0; i < items.length; i++) {
                var matchItem = {};
                matchItem.name = "";
                matchItem.path = items[i].path;

                if (matchItem.path.length > 4) {

                    for (var j = 0; j < matchItem.path.length; j++) {
                        if (j == 2) {

                            for (var k = matchItem.path.length - 2; j > 0; (j-- && k++)) {
                                matchItem.name += matchItem.path[k].name;
                                if ((k + 1) != matchItem.path.length) {
                                    matchItem.name += " | ";
                                }


                            }
                            break;

                        }
                        if (j == 1) {
                            matchItem.name += matchItem.path[j].name + " |...| ";
                        }
                        else {
                            matchItem.name += matchItem.path[j].name + " | ";

                        }

                    }

                }
                else {

                    for (var j = 0; j < matchItem.path.length; j++) {
                        matchItem.name += matchItem.path[j].name;
                        if (matchItem.path.length != (j + 1)) {
                            matchItem.name += " | ";
                        }


                    }

                }


                $scope.searchResult.push(matchItem);

            }

            autocomplete(document.getElementById("myInput"), $scope.searchResult);

        }

        function SearchResultFail() {

        }
        //end of search implementation
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
            if (uniqueId == null) {
                $timeout(function () {
                    updateSelectedNode(uniqueId);
                }, 0);
            }
            else {
                $timeout(function () {

                    angular.element('.ivh-treeview-node-label').removeClass("selected");
                    var element = document.getElementById(uniqueId);
                    var span = angular.element(element).find("span");

                    for (var i = 0; i < span.length; i++) {
                        if (angular.element(span[i]).hasClass('ivh-treeview-node-label')) {
                            angular.element(span[i]).addClass("selected");
                            break;
                        }
                    }
                }, 0);
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
            controller: ['$log', 'serviceEndpoint', '$http', '$cookies', '$scope', 'apiService', '$window', 'tree', 'update_breadcrumbs', 'update_brandingContent', 'share_parent', '$timeout', 'getChild', controller],
            controllerAs: 'hc'
        });

})();
