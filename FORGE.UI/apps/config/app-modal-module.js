var app = angular.module('modal-module', [])


    .controller("modal_controller", function ($scope, share_data, $http, $cookies) {
        var apps = "";

        $scope.app = {};
        var node;
        $scope.method_name;

        function Tree(node) {

            this._root = node;
        }


        Tree.prototype.create_app_group = function (callback) {


            (function recurse(currentNode) {

                for (var i = 0, length = currentNode.children.length; i < length; i++) {

                    if ($scope.new_obj.parent_id == currentNode.children[i].id && (currentNode.children[i].children[0].label != "No Records Found" && currentNode.children[i].children[0].label != "Loading...")) {
                        var found = false, url = "";

                        for (var j = 0; j < share_data.data._links.length; j++) {
                            if (share_data.data._links[j].rel == "applications") {
                                found = true;
                                url = share_data.data._links[j].href;
                                break;
                            }
                        }
                        if (found) {
                            var _token = JSON.parse($cookies.get('profile'))._token;
                            $http.get(url, { headers: { 'Authorization': _token } })
                            .then(function (response) {

                                var parent_node = share_data.data;
                                parent_node.children = [];

                                for (var k = 0; k < response.data.data.items.length; k++) {

                                    var child_node;
                                    child_node = {
                                        label: response.data.data.items[k].name,
                                        id: response.data.data.items[k].id,
                                        parent: share_data.data,
                                        unique: Math.random(),
                                        value: response.data.data.items[k].value,
                                        _links: response.data.data.items[k]._links,
                                        type: 'C1',
                                        children: []
                                    };


                                    child_node.children.push({
                                        label: 'Loading...',
                                        id: 0,
                                        type: 'DEL',
                                        children: []
                                    });
                                    parent_node.children.push(child_node);
                                }
                                currentNode.children.splice(i, 1, parent_node);

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

                    if ($scope.new_obj.parent_id == currentNode.unique) {

                        $scope.new_obj.child.unique = Math.random();

                        for (var k = 0; k < currentNode.children.length; k++) {

                            $scope.new_obj.child.unique = Math.random();

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

                            $scope.new_obj.child.unique = Math.random();

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


        $scope.$on('handleBroadcast', function () {
            $scope.app.value = null;
            $scope.app.name = null;
            $scope.nodes_list = share_data.root;


            $scope.op = $scope.method_name = share_data.op;
            var links = share_data.data._links;
            $scope.applications = share_data.data;
            $scope.pre_name = share_data.data.label;
            $scope.parent_un = share_data.data.unique;
            $scope.parent_id = share_data.data.id;


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

                if ($scope.op == 'edit') {


                    $scope.app.name = share_data.data.label;
                    if (share_data.data.value != undefined) {
                        $scope.app.show_value = true;
                        $scope.app.value = share_data.data.value;
                        $scope.pre_value = share_data.data.value;
                        $scope.app.header = 'Edit';

                    }
                    else { $scope.app.show_value = false; $scope.app.header = 'Edit'; }
                }
                else {
                    if (apps == "applications" && $scope.op == "add") {
                        $scope.app.show_value = true;
                        $scope.app.header = 'Create';
                    }
                    if (apps == "applicationGroups" && $scope.op == "add") {
                        $scope.app.show_value = false;
                        $scope.app.header = 'Create';
                    }
                    if ($scope.op == "add_ag") {
                        $scope.app.header = 'Create apps Group';
                        $scope.app.show_value = false;
                    }
                }
            }

        });





        $scope.action = function () {
            var valid_name = true;
            var valid_value = true;
            var name = $scope.app.name;
            var value = $scope.app.value;

            if (name == 'null' || name == undefined) {
                $scope.app.name_required = true;
                valid_name = false;
            }
            if (value == 'null' || value == undefined) {
                $scope.app.value_required = true;
                valid_value = false;
            }
            if (valid_value || valid_name) {
                var node = $scope.nodes_list[0];
                var tree = new Tree(node);




                var links = $scope.applications._links;


                var url = "", rel = "";

                for (var i = 0; i < links.length; i++) {

                    if ($scope.op == 'add_ag') {

                        if (apps == "applications" && links[i].rel == "createApplicationGroup") {

                            url = links[i].href;
                            rel = links[i].rel;
                            break;
                        }
                    }
                    if ($scope.op == 'add') {
                        if ((links[i].rel == "createApplicationGroup" && apps == "applicationGroups") || ((links[i].rel == "createApplication") && apps == "applications")) {

                            url = links[i].href;
                            rel = links[i].rel;
                            break;
                        }
                    }
                    if ($scope.op == 'edit') {
                        if ((links[i].rel == "updateApplicationGroup" && apps == "applications") || (links[i].rel == "updateApplication" && apps == "applicationGroups")) {

                            url = links[i].href;
                            rel = links[i].rel;
                            break;
                        }
                    }

                }
                var token = JSON.parse($cookies.get('profile'))._token;

                if (rel == 'createApplication') {

                    $http.post(url,
                        { "name": $scope.app.name, "value": $scope.app.value }, {
                            headers: {
                                "Authorization": token,
                                "Content-type": "application/json"
                            }
                        })
                   .then(function (response) {




                       var child_node;
                       child_node = {
                           label: response.data.data.name,
                           id: response.data.data.id,
                           parent: share_data.data.parent,
                           value: response.data.data.value,
                           _links: response.data.data._links,
                           type: 'C1',
                           children: []
                       };


                       child_node.children.push({
                           label: 'Loading...',
                           id: 0,
                           type: 'DEL',
                           children: []
                       });

                       $scope.new_obj = { parent_id: $scope.parent_un, child: child_node };
                       tree.create(function (node) { });

                       $('#' + $scope.op).modal('hide');
                       $scope.new_obj = null;

                   },
                   function (error) {

                   })
                }
                if (rel == 'updateApplication') {

                    if ($scope.applications.value === undefined) {
                        $scope.app.value = "-1";
                    }


                    $http.put(url,
                    { "name": $scope.app.name, "value": $scope.app.value }, {
                        headers: {
                            "Authorization": token,
                            "Content-type": "application/json"
                        }
                    })
               .then(function (response) {
                   var child_node;
                   if ($scope.nodes_list[0].id == response.data.data.id) {
                       child_node = {
                           label: response.data.data.name,
                           id: response.data.data.id,
                           parent: share_data.data.parent,
                           unique: Math.random(),
                           _links: response.data.data._links,
                           type: 'C1',
                           children: []
                       };


                       child_node.children.push({
                           label: 'Loading...',
                           id: 0,
                           type: 'DEL',
                           children: []
                       });
                   }
                   else {
                       child_node = {
                           label: response.data.data.name,
                           id: response.data.data.id,
                           parent: share_data.data.parent,
                           unique: Math.random(),
                           value: response.data.data.value,
                           _links: response.data.data._links,
                           type: 'C1',
                           children: []
                       };


                       child_node.children.push({
                           label: 'Loading...',
                           id: 0,
                           type: 'DEL',
                           children: []
                       });
                   }
                   $scope.new_obj = { id: response.data.data.id, child: child_node };
                   if ($scope.nodes_list[0].id == response.data.data.id) {
                       $scope.pre_child = $scope.nodes_list[0].children;
                       $scope.new_obj.child.children = $scope.pre_child;
                       $scope.nodes_list.splice(0, 1, $scope.new_obj.child);
                   }
                   else {
                       tree.update(function (node) { });
                   }

                   $('#' + $scope.op).modal('hide');

                   $scope.new_obj = null;

               },
               function (error) {

               })




                }

                if (rel == 'createApplicationGroup') {

                    $http.post(url,
                        { "name": $scope.app.name, "isEncrypted": "false" }, {
                            headers: {
                                "Authorization": token,
                                "Content-type": "application/json"
                            }
                        })
                   .then(function (response) {

                       var child_node;
                       child_node = {
                           label: response.data.data.name,
                           id: response.data.data.id,
                           parent: share_data.data.parent,
                           unique: Math.random(),
                           _links: response.data.data._links,
                           type: 'C1',
                           children: []
                       };


                       child_node.children.push({
                           label: 'Loading...',
                           id: 0,
                           type: 'DEL',
                           children: []
                       });

                       if ($scope.method_name == "add_ag") {


                           $scope.new_obj = { parent_id: $scope.parent_id, response: response.data.data };
                           tree.create_app_group(function (node) { });

                           $scope.new_obj = null;
                       }
                       else {
                           $scope.new_obj = { parent_id: $scope.parent_un, child: child_node };
                           tree.create(function (node) { });
                           $scope.new_obj = null;
                       }


                       $('#' + $scope.op).modal('hide');
                       $scope.new_obj = null;
                   },
                   function (error) {

                   })
                }
                if (rel == 'updateApplicationGroup') {

                    $http.put(url,
                        { "name": $scope.app.name }, {
                            headers: {
                                "Authorization": token,
                                "Content-type": "application/json"
                            }
                        })
                   .then(function (response) {

                       var child_node;
                       child_node = {
                           label: response.data.data.name,
                           id: response.data.data.id,
                           parent: share_data.data.parent,
                           _links: response.data.data._links,
                           type: 'C1',
                           children: []
                       };


                       child_node.children.push({
                           label: 'Loading...',
                           id: 0,
                           type: 'DEL',
                           children: []
                       });

                       $scope.new_obj = { id: response.data.data.id, child: child_node };


                       tree.update(function (node) { });


                       $('#' + $scope.op).modal('hide');
                       $scope.new_obj = null;
                   },
                   function (error) {

                   })
                }


            }

        }
    })

