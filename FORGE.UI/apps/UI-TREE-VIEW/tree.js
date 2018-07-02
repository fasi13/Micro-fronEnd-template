var app = angular.module('tree', []);

app.factory('tree', tree);

function tree($compile) {

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



    function getNodeHtml(node) {

        return [
            '<div ng-if="node.isRecordFound" class="ivh-treeview-node-content" title="{{::node.label}}">',
             '<div class="{{::node.IsApplicationGroup ? \'row add-bg\' : \' row parent\'}}" mouse-enter node="node" >',
                '<div   class="cust-col nopadding">',
                   '<span ivh-treeview-toggle>',
                    '<span ng-if="node.isRecordFound" class="ivh-treeview-twistie-wrapper" ivh-treeview-twistie ></span>',
                      '<span class="ivh-treeview-node-label">',
                        '{{:: (node.value != undefined && node.value != -1 ) ? node.label + " ("+node.value +")" : node.label}}',
                     '</span>',
                  '</span>',
             '</div>',
       '<div  class="nopadding cust-width">',
        '</div>',
        '</div>',
       '<div ivh-treeview-children></div>',
     '</div>'
        ].join('\n');
    }


    function ifRelExist(node, rel1, rel2) {

        var length = node._links.length;
        var i = 0;
        for (i; i < length; i++) {
            if (node._links[i].rel == rel1 || node._links[i].rel == rel2) {

                return true;
            }
        }

    }
    function getRelForCreateAppGroup(node) {


        var length = node._links.length;
        var i = 0;
        for (i; i < length; i++) {
            var app_rel;
            if (node._links[i].rel == "applications") {

                app_rel = node._links[i].rel;
                var j = 0;
                for (j; j < length; j++) {
                    if (node._links[j].rel == "createApplicationGroup" && app_rel == "applications") {
                        return true;
                    }
                }
                break;
            }
        }
    }

    function getTitle(node, rel1, rel2) {
        var length = node._links.length;
        var i = 0;
        for (i; i < length; i++) {
            if (node._links[i].rel == rel1) {

                return "Application";
            }
            if (node._links[i].rel == rel2) {

                return "Application Group";
            }
        }

    }
    //label: description of node
    //hasFakechild: The reason of this parameter is use to create a dummy "loading..."
    //              node, to tell the ivh-treeview to show "Expanded" icon because we're not sure
    //              where every node has child
    self.makeNode = function (label, parent, hasFakechild) {

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
        node.isRecordFound = (node.label == "") ? false : true;
        node.isEditApp = ifRelExist(node, "updateApplication", "updateApplicationGroup");

        node.isAddApp = ifRelExist(node, "createApplicationGroup", "createApplication");


        node.isCreateAppGroup = getRelForCreateAppGroup(node);


        var html = $compile(getNodeHtml(node));
        if (hasFakechild) {
            node.children.push({
                label: 'Loading...',
                id: 0,
                type: 'DEL',  //Use for determine whether to load from server or delete the node
                children: [],

            });


            node.children[0].isRecordFound = true;
            node.children[0].html = html;
        }
        node.html = html;
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

            list.push({ name: "", _links: [] });
            node = self.makeNode(list.shift(), null, false);

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
            // 
            node.isRecordFound = (node.label == "") ? false : true;

            node.isEditApp = ifRelExist(node, "updateApplication", "updateApplicationGroup");

            node.isAddApp = ifRelExist(node, "createApplicationGroup", "createApplication");

            node.children[0].isRecordFound = true;
            node.isCreateAppGroup = getRelForCreateAppGroup(node);
            var html = $compile(getNodeHtml(node));
            node.children[0].html = html;
            node.html = html;
            // node.addTitle = getTitle(node, "applications", "applicationGroups");




            nodes.push(node);
            return nodes;
        }
        else if (list.length > 0) {
            while (list !== null && list.length) {

                node = self.makeNode(list.shift(), parent, hasFakechild);

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


