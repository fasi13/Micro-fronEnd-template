var app = angular.module('app-share_data-fac', [])
    .directive("mouseEnter", function (shareHierarchyData, tree, apiService, getChild) {

        return {
            restrict: 'A',
            scope: {
                node: "=node"
            },
            link: function (scope, element, attrs) {
                var node = scope.node;
                var span = $(element).find("span");

                $(element).bind("mouseenter", function (event) {

                    if (node.isRecordFound) {

                        var divElement = document.createElement("span");
                        divElement.classList.add("pull-right");
                        divElement.classList.add("show-icon");

                        if (node.isCreateAppGroup) {

                            var spanElement = document.createElement("span");
                            spanElement.setAttribute("title", "Add Application Group");


                            spanElement.addEventListener("click", function (event) {
                                shareHierarchyData.get_data(node);
                                shareHierarchyData.get_op("add_ag");


                                $('#addEditModal').modal('show');
                            });


                            var imgsrcElement = document.createElement("img");
                            imgsrcElement.setAttribute("src", "imgs/views-icon.png");
                            imgsrcElement.setAttribute("class", "glif_icon");
                            spanElement.appendChild(imgsrcElement);

                            divElement.appendChild(spanElement);
                        }
                        if (node.isAddApp) {

                            var spanElement = document.createElement("span");

                            spanElement.setAttribute("title", "Add");
                            spanElement.addEventListener("click", function (event) {

                                shareHierarchyData.get_data(node);
                                shareHierarchyData.get_op("add");

                                $('#addEditModal').modal('show');

                            });


                            spanElement.setAttribute("class", "glyphicon glyphicon-pencil");


                            divElement.appendChild(spanElement);
                        }
                        if (node.isEditApp) {

                            var spanElement = document.createElement("span");

                            spanElement.setAttribute("title", "Edit");
                            spanElement.addEventListener("click", function (event) {
                                shareHierarchyData.get_data(node);
                                shareHierarchyData.get_op("edit");


                                $('#addEditModal').modal('show');
                            });


                            spanElement.setAttribute("class", "glyphicon glyphicon-edit");

                            divElement.appendChild(spanElement);
                        }


                        $(element).find('.cust-width').append(divElement);

                    }


                });

                $(element).bind('mouseleave', function (event) {

                    if (node.isRecordFound) {

                        $(element).find('.cust-width').empty();

                    }
                });


                span[0].onclick = function () {
                    var currentNodeIsAppGroup = false;
                    if (node.parent != null) {
                        currentNodeIsAppGroup = node.IsApplicationGroup;
                    }
                    if (!currentNodeIsAppGroup) {

                        angular.element('.ivh-treeview-node-label').removeClass("selected");
                        element.find('.ivh-treeview-node-label').addClass("selected");
                        shareHierarchyData.clickedNode(node, shareHierarchyData.root);
                        angular.element(document.getElementById('configureBtn'))[0].disabled = false;
                    }
                    else {
                        angular.element(document.getElementById('configureBtn'))[0].disabled = true;
                    }


                    if (node.type == 'S') {
                        return;

                    }

                    if (node.children !== null & node.children.length > 0) {
                        if (node.children[0].type != 'DEL') {

                            return;//Loaded Parent, not need to load again
                        }
                    }


                    var url = "";
                    var fakechild = true;



                    switch (node.type) {
                        case 'C1':
                            angular.forEach(node._links, function (linksVal, linksKey) {
                                if (linksVal.rel == "applicationGroups" || linksVal.rel == "applications") {
                                    url = linksVal.href;
                                    fakechild = true;
                                }
                            });

                            break;
                        case 'S':  //Is the last node. need to stop
                            break;
                    }

                    apiService.get(url,
                            loadCompleted,
                            loadFailed, shareHierarchyData.token);


                    function loadCompleted(result) {

                        if (result.status == 200) {

                            tree.genNode(result.data.data.items, node, fakechild);
                            if (node.click == "autoClick") {
                                getChild.setChild(node.children);
                            }

                            if (node.children[0].type == 'DEL') {
                                delete node.children
                            }

                        } else {
                            alert('Tree leaf loaded failed - ' + node.type + ' ' + result.error);
                        }


                    }

                    function loadFailed(result) {
                        // ivhTreeviewMgr.collapse(root, node);
                        alert('Tree leaf loaded failed - ' + node.type + ' ' + result.error);
                    }
                    function initVerticalScroll() {
                        $('#hierarchyVerticalScroll').mCustomScrollbar({
                            theme: "dark",
                            scrollButtons: {
                                enable: true
                            },
                            scrollInertia: 0,
                            advanced: {
                                autoScrollOnFocus: false,
                                updateOnContentResize: true
                            }
                        });

                    }
                    initVerticalScroll();


                };
            }
        }

    })

    .factory('isStateChange', function ($rootScope) {
        var shareObj = {};


        shareObj.buttonClicked = false;


        return shareObj;
    })
.factory('stateChangeData', function ($rootScope) {
    var shareObj = {};


    shareObj.stateData = {};



    return shareObj;
})


.factory('getChild', function ($rootScope) {


    var shareObj = {};

    shareObj.child = {};

    shareObj.setChild = function (node) {
        this.child = node;
        this.update();
    };
    shareObj.update = function () {
        $rootScope.$broadcast('childUpdated');
    };

    return shareObj;

})

.factory('update_brandingContent', function ($rootScope) {

    var shareObj = {};
    shareObj.node = {};
    shareObj.updateSection = false;
    shareObj.set_branding = function (getAttributeURL) {
        this.node = getAttributeURL;

        this.updateBranding();
    };
    shareObj.updateSectionValues = function (value) {
        this.updateSection = value;

    };
    shareObj.updateBranding = function () {
        $rootScope.$broadcast('CreateHierarchyRightContent');
    };

    return shareObj;

})
.factory('updateContentGroup', function ($rootScope) {


    var shareObj = {};

    shareObj.contentGroup = {};
    shareObj.isAdd = true;
    shareObj.setContentGroup = function (node, isAdd) {
        this.contentGroup = node;
        shareObj.isAdd = isAdd;
        this.update();
    }

    shareObj.update = function () {
        $rootScope.$broadcast('contentGroupsChanged');
    };

    return shareObj;

})
.factory('collapseHierarchy', function ($rootScope) {

    var collapseObj = {};
    collapseObj.collapse = true;
    collapseObj.closeHierarchy = function () {
        this.collapse = true;

        this.update();
    }

    collapseObj.update = function () {
        $rootScope.$broadcast('collapseHierarchy');
    };

    return collapseObj;

})
.factory('gotoContentViewState', function ($rootScope) {

    var contentGroups = {};
    contentGroups.groups = {};
    contentGroups.auto = false;

    contentGroups.gotoContentView = function (contentGroups) {
        this.groups = contentGroups;

        this.update();
    }
    contentGroups.setAuto = function (isAuto) {

        this.auto = isAuto;
        this.update();
    }
    contentGroups.update = function () {
        $rootScope.$broadcast('gotoContentViewState');
    };

    return contentGroups;

})
.factory('logoimg', function ($rootScope) {

    var img = {};
    img.SecondaryLogourl = {};
    img.PrimaryLogoURL = {};


    img.setSecondaryLogoURL = function (img) {
        this.SecondaryLogourl = img;
        this.update();
    }
    img.setPrimaryLogoURL = function (img) {
        this.PrimaryLogoURL = img;
        this.update();
    }

    img.update = function () {
        $rootScope.$broadcast('updatelogoIMG');
    };

    return img;

})
.factory('updateConfigNode', function ($rootScope) {


    var shareObj = {};


    shareObj.configuredNode = {};
    shareObj.configNode = function (node) {
        this.configuredNode = node;
        this.update();
    }

    shareObj.update = function () {
        $rootScope.$broadcast('configNodeUpdated');
    };

    return shareObj;

})
.factory('shareHierarchyData', function ($rootScope) {


    var shareObj = {};

    shareObj.operationName = '';
    shareObj.data = {}
    shareObj.root = {};
    shareObj.node = {};
    shareObj.parent = {};
    shareObj.token;
    shareObj.configuredNode = {};
    shareObj.configNode = function (node) {
        this.configuredNode = node;
        this.update();
    }
    shareObj.clickedNode = function (node, parent) {
        this.node = node;
        this.parent = parent;
        this.update();
    };
    shareObj.update = function () {
        $rootScope.$broadcast('onApplicationSelected');
    };
    shareObj.get_op = function (method) {
        this.operationName = method;
        this.broadcastItem();
    };
    shareObj.get_root = function (root) {
        this.root = root;
        this.broadcastItem();
    }
    shareObj.setRoot = function (root) {
        this.root = root;
        this.updateRoot();
    }


    shareObj.get_data = function (data_obj) {
        this.data = data_obj;
        this.broadcastItem();
    };
    shareObj.updateRoot = function () {
        $rootScope.$broadcast('rootChanged');
    };

    shareObj.broadcastItem = function () {
        $rootScope.$broadcast('handleBroadcast');
    };


    return shareObj;

})