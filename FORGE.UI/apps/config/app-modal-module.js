var app = angular.module('modal-module', [])


    .controller("modal_controller", function ($scope, shareHierarchyData, $http, $cookies, apiService, $rootScope, tree) {
        var apps = "";

        $scope.app = {};
        var node;
        $scope.operationName;

        function Tree(node) {

            this._root = node;
        }

        Tree.prototype.create_app_group = function (callback) {


            (function recurse(currentNode) {

                for (var i = 0, length = currentNode.children.length; i < length; i++) {

                    if ($scope.new_obj.parentId == currentNode.children[i].id && (currentNode.children[i].children[0].label != "No Records Found" && currentNode.children[i].children[0].label != "Loading...")) {
                        var found = false, url = "";

                        for (var j = 0; j < shareHierarchyData.data._links.length; j++) {
                            if (shareHierarchyData.data._links[j].rel == "applications") {
                                found = true;
                                $scope.recentNode = shareHierarchyData.data;
                                url = shareHierarchyData.data._links[j].href;
                                break;
                            }
                        }
                        if (found) {
                            var _token = JSON.parse($cookies.get('profile'))._token;
                            apiService._get($http, url, { 'Authorization': _token })
                            .then(function (response) {

                                var parentNode = shareHierarchyData.data;
                                parentNode.children = [];

                                for (var k = 0; k < response.data.data.items.length; k++) {

                                    var child_node = tree.makeNode(response.data.data.items[k], shareHierarchyData.data, true);
                                    parentNode.children.push(child_node);
                                }
                                currentNode.children.splice(i, 1, parentNode);

                            }, function (error) {


                            })
                        }


                        return;
                    }

                    recurse(currentNode.children[i]);
                }

                callback(currentNode);
            })(this._root);

        };

        Tree.prototype.create = function (callback) {

            (function recurse(currentNode) {

                for (var i = 0, length = currentNode.children.length; i < length; i++) {

                    if ($scope.new_obj.parentId == currentNode.unique) {
                        $scope.new_obj.child.parent = currentNode;

                        for (var k = 0; k < currentNode.children.length; k++) {


                            $scope.recentNode = $scope.new_obj.child;
                            if (currentNode.children[k].label == "No Records Found") {

                                currentNode.children.splice(k, 1, $scope.new_obj.child);
                                break;
                            }
                            else {

                                currentNode.children.push($scope.new_obj.child);
                                break;
                            }
                        }


                        return;

                    }
                    recurse(currentNode.children[i]);
                }


                callback(currentNode);


            })(this._root);

        };

        Tree.prototype.update = function (callback) {

            (function recurse(currentNode) {
                var parent = currentNode;

                for (var i = 0, length = currentNode.children.length; i < length; i++) {

                    if ($scope.new_obj.id === currentNode.children[i].id) {

                        for (var k = 0; k < parent.children.length; k++) {

                            $scope.recentNode = $scope.new_obj.child;
                            if (parent.children[k].id == $scope.new_obj.id) {

                                parent.children.splice(k, 1, $scope.new_obj.child);

                            }

                        }
                        return;
                    }
                    recurse(currentNode.children[i]);
                }


                callback(currentNode);


            })(this._root);

        };


        $(document).on('hidden.bs.modal', '#addEditModal', function () {

            $rootScope.$emit("updateScroll", { node: $scope.recentNode });
        });



        $scope.$on('handleBroadcast', function () {
            $scope.app.value = null;
            $scope.app.name = null;
            $scope.nodesList = shareHierarchyData.root;

            if (shareHierarchyData.data._links != undefined) {
                $scope.operationName = shareHierarchyData.operationName;
                var links = shareHierarchyData.data._links;
                $scope.applications = shareHierarchyData.data;
                $scope.parentUniqueId = shareHierarchyData.data.unique;
                $scope.parentId = shareHierarchyData.data.id;


                $scope.myform.$submitted = false;
                if (links.length != undefined) {

                    $scope.app.name_required = false;
                    $scope.app.value_required = false;

                    for (var j = 0; j < links.length; j++) {
                        if (links[j].rel == "applications" || links[j].rel == "applicationGroups") {
                            apps = links[j].rel;
                            break;
                        }
                    }

                    if ($scope.operationName == 'edit') {


                        $scope.app.name = shareHierarchyData.data.label;
                        if (shareHierarchyData.data.value != undefined) {
                            $scope.app.show_value = true;
                            $scope.app.value = shareHierarchyData.data.value;
                            $scope.app.header = 'Edit';

                        }
                        else { $scope.app.show_value = false; $scope.app.header = 'Edit'; }
                    }
                    else {
                        if (apps == "applications" && $scope.operationName == "add") {
                            $scope.app.show_value = true;
                            $scope.app.header = 'Create';
                        }
                        if (apps == "applicationGroups" && $scope.operationName == "add") {
                            $scope.app.show_value = false;
                            $scope.app.header = 'Create';
                        }
                        if ($scope.operationName == "add_ag") {
                            $scope.app.header = 'Create apps Group';
                            $scope.app.show_value = false;
                        }
                    }
                }
            }
        });





        $scope.saveDataForModalDialog = function () {
            var validateName = true;
            var validateValue = true;

            if ($scope.app.name == 'null' || $scope.app.name == undefined) {
                $scope.app.name_required = true;
                validateName = false;
            }
            if ($scope.app.value == 'null' || $scope.app.value == undefined) {
                $scope.app.value_required = true;
                validateValue = false;
            }
            if (validateValue || validateName) {
                var node = $scope.nodesList;
                var hierarchyTree = new Tree(node);
                var links = $scope.applications._links;
                var url = "", rel = "";
                for (var i = 0; i < links.length; i++) {

                    if ($scope.operationName == 'add_ag') {

                        if (apps == "applications" && links[i].rel == "createApplicationGroup") {

                            url = links[i].href;
                            rel = links[i].rel;
                            break;
                        }
                    }
                    if ($scope.operationName == 'add') {
                        if ((links[i].rel == "createApplicationGroup" && apps == "applicationGroups") || ((links[i].rel == "createApplication") && apps == "applications")) {

                            url = links[i].href;
                            rel = links[i].rel;
                            break;
                        }
                    }
                    if ($scope.operationName == 'edit') {
                        if ((links[i].rel == "updateApplicationGroup" && apps == "applications") || (links[i].rel == "updateApplication" && apps == "applicationGroups")) {

                            url = links[i].href;
                            rel = links[i].rel;
                            break;
                        }
                    }

                }
                var token = JSON.parse($cookies.get('profile'))._token;

                if (rel == 'createApplication') {

                    apiService._post($http, url,
                         { "name": $scope.app.name, "value": $scope.app.value }, {
                             "Authorization": token,
                             "Content-type": "application/json"
                         })
                   .then(function (response) {



                       var child_node = tree.makeNode(response.data.data, shareHierarchyData.data, true);


                       $scope.new_obj = { parentId: $scope.parentUniqueId, child: child_node };
                       hierarchyTree.create(function (node) { });

                       $('#addEditModal').modal('hide');
                       $scope.new_obj = null;

                   },
                   function (error) {

                   })
                }
                if (rel == 'updateApplication') {

                    if ($scope.applications.value === undefined) {
                        $scope.app.value = "-1";
                    }


                    apiService._put($http, url,
                    { "name": $scope.app.name, "value": $scope.app.value }, {
                        "Authorization": token,
                        "Content-type": "application/json"
                    })
               .then(function (response) {
                   var child_node;


                   if ($scope.nodesList.id == response.data.data.id) {

                       child_node = tree.makeNode(response.data.data, null, true);

                   }
                   else {
                       child_node = tree.makeNode(response.data.data, shareHierarchyData.data.parent, true);

                   }
                   $scope.new_obj = { id: response.data.data.id, child: child_node };
                   if ($scope.nodesList.id == response.data.data.id) {
                       $scope.pre_child = $scope.nodesList.children;
                       $scope.new_obj.child.children = $scope.pre_child;

                       shareHierarchyData.setRoot($scope.new_obj.child);
                       $scope.nodesList = $scope.new_obj.child;
                   }
                   else {
                       hierarchyTree.update(function (node) { });
                   }

                   $('#addEditModal').modal('hide');

                   $scope.new_obj = null;

               },
               function (error) {

               })




                }

                if (rel == 'createApplicationGroup') {

                    apiService._post($http, url,
                       { "name": $scope.app.name, "isEncrypted": "false" }, {
                           "Authorization": token,
                           "Content-type": "application/json"
                       })
                   .then(function (response) {

                       var child_node = tree.makeNode(response.data.data, shareHierarchyData.data, true);

                       if ($scope.operationName == "add_ag") {


                           $scope.new_obj = { parentId: $scope.parentId, response: response.data.data };
                           hierarchyTree.create_app_group(function (node) { });

                           $scope.new_obj = null;
                       }
                       else {
                           $scope.new_obj = { parentId: $scope.parentUniqueId, child: child_node };
                           hierarchyTree.create(function (node) { });
                           $scope.new_obj = null;
                       }


                       $('#addEditModal').modal('hide');
                       $scope.new_obj = null;
                   },
                   function (error) {

                   })
                }
                if (rel == 'updateApplicationGroup') {

                    apiService._put($http, url,
                        { "name": $scope.app.name }, {
                            "Authorization": token,
                            "Content-type": "application/json"
                        })
                   .then(function (response) {

                       var child_node = tree.makeNode(response.data.data, shareHierarchyData.data.parent, true);
                       $scope.new_obj = { id: response.data.data.id, child: child_node };


                       hierarchyTree.update(function (node) { });


                       $('#addEditModal').modal('hide');
                       $scope.new_obj = null;
                   },
                   function (error) {

                   })
                }


            }

        }
    })

