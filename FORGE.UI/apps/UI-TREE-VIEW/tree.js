var app = angular.module('tree', []);

app.factory('tree', tree);

function tree() {

    var self = this;
    function IsApplicationGroup(node) {
        var isAppGroup = false;
        if (node != null) {
            angular.forEach(node._links, function (linksVal, linksKey) {
                if (linksVal.rel == "applicationGroups") {
                    isAppGroup = true;
                }
            });
        }
        return isAppGroup;
    }
    //label: description of node
    //hasFakechild: The reason of this parameter is use to create a dummy "loading..."
    //              node, to tell the ivh-treeview to show "Expanded" icon because we're not sure
    //              where every node has child
    var makeNode = function (label, parent, hasFakechild) {

        var node;
            node = {
                label: label.name,
                value: label.value,
                id: label.id,
                parent: parent,
                unique: Math.random(),
                _links: label._links,
                type: 'C1',
                children: [],
                IsApplicationGroup: IsApplicationGroup(parent)
            };
        //Create dummy for speed up loading & make library show "Expand" icon
        //child nodes only load when 'leaf element click in directive

        if (hasFakechild) {
            node.children.push({
                label: 'Loading...',
                id: 0,
                type: 'DEL',  //Use for determine whether to load from server or delete the node
                children: []
            });
        }

        return node;
    };

    var makeChild = function (node, parent) {
        return {
            label: label.Name,
            unique: Math.random(),
            id: label.ID,
            parent: parent,
            type: label.Type,
            children: []
        };
    };
    //list: json data getting from server
    //parent: parent node
    //hasFakechild: The reason of this parameter is use to create a dummy "loading..."
    //              node, to tell the ivh-treeview to show "Expanded" icon because we're not sure
    //              where every node has child
    self.genNode = function (list, parent, hasFakechild) {

        var node = [],
            key = '',
            nodeChild = [],
            i = 0,
            temp = [],
            nodes = [];
        // if the return list's length is zero add new child with No Records Found
        if (list.length === 0) {

            list.push({ name: "No Records Found", _links: [] });
            node = makeNode(list.shift(), null, false);

            node.selected = parent === null ? node.selected : parent.selected;
            if (parent !== null) {
                if (parent.children[0].type == 'DEL') {//Remove the dummy node
                    parent.children.splice(0);
                }
                parent.children.push(node);
            } else {
                nodes.push(node);

            }
        }


        if (list.length == undefined) {

            node = {
                label: list.name,
                id: list.id,
                unique: Math.random(),
                _links: list._links,
                parent: parent,
                type: 'C1',
                children: [],
                IsApplicationGroup: false
            };
            node.children.push({
                label: 'Loading...',
                id: 0,
                type: 'DEL',  //Use for determine whether to load from server or delete the node
                children: []
            });
            nodes.push(node);
            return nodes;
        }
        else if (list.length > 0) {
            while (list !== null && list.length) {

                node = makeNode(list.shift(), parent, hasFakechild);

                node.selected = parent === null ? node.selected : parent.selected;
                if (parent !== null) {
                    if (parent.children[0].type == 'DEL') {//Remove the dummy node
                        parent.children.splice(0);
                    }
                    parent.children.push(node);
                } else {
                    nodes.push(node);

                }
                i++;
            }
        }

        if (parent !== null) {
            return parent;
        } else {
            return nodes;
        }
    }

    return self;
}


