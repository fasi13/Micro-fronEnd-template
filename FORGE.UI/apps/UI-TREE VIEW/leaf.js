var app = angular.module('instinctcoder', [])
'use strict';

app.directive('leaf', function (tree, ivhTreeviewMgr, $window, apiService, $cookies) {
    return {
        restrict: 'AE',
        link: function (scope, element, attrs) {

            element.on('click', function () {
                var root = scope.trvw.root();
                if (scope.node.type == 'S') {
                    return;

                }

                if (scope.node.children !== null & scope.node.children.length > 0) {
                    if (scope.node.children[0].type != 'DEL') {

                        return;//Loaded Parent, not need to load again
                    }
                }


                var url = "";
                var fakechild = true;


                switch (scope.node.type) {
                    case 'C1':
                        angular.forEach(scope.node._links, function (linksVal, linksKey) {
                            if (linksVal.rel == "applicationGroups" || linksVal.rel == "applications") {
                                url = linksVal.href;
                                fakechild = true;
                            }
                        });

                        break;
                    case 'S':  //Is the last node. need to stop
                        break;
                }
                var _token = JSON.parse($cookies.get('profile'))._token;
                apiService.get(url,
                        loadCompleted,
                        loadFailed, _token);


                function loadCompleted(result) {
                    if (result.status == 200) {

                        if (result.data != "") 
                        {
                            tree.genNode(result.data.data.items, scope.node, fakechild);
                        } else {
                            if (scope.node.children[0].type == 'DEL') {
                                delete scope.node.children
                            }
                        }
                    } else {
                        $window.alert('Tree leaf loaded failed - ' + scope.node.type + ' ' + result.error);
                    }


                }

                function loadFailed(result) {
                    ivhTreeviewMgr.collapse(root, scope.node);
                    $window.alert('Tree leaf loaded failed - ' + scope.node.type + ' ' + result.error);
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
            });
        }
    };
});


