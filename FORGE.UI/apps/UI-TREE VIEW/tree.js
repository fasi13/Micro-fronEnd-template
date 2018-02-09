    var app = angular.module('tree',[]);
     
    app.factory('tree', tree);
    
    function tree() {
 
        var self =this;
        //label: description of node
        //hasFakechild: The reason of this parameter is use to create a dummy "loading..."
        //              node, to tell the ivh-treeview to show "Expanded" icon because we're not sure
        //              where every node has child
        var makeNode = function (label, hasFakechild) {
            var node;
            if (label.value == null) {
                node = {
                    label: label.name,
                    id: label.id,
                   
                    _links: label._links,
                    type: 'C1',
                    children: []
                };

            }
            else{
                node ={
                    label: label.name, 
                    id: label.id,
                    value:label.value,
                    _links: label._links,
                    type: 'C1',
                    children: []
                };
            }
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

        var makeChild = function (node) {
            return {
                label: label.Name,
                id: label.ID,
                type: label.Type,
                children: []
            };
        };
        //list: json data getting from server
        //parent: parent node
        //hasFakechild: The reason of this parameter is use to create a dummy "loading..."
        //              node, to tell the ivh-treeview to show "Expanded" icon because we're not sure
        //              where every node has child
        self.genNode =  function (list, parent, hasFakechild) {

            var node = [],
                key='',
                nodeChild = [],
                i=0,
                temp = [],
                nodes = [];
            // if the return list's length is zero add new child with No Records Found
            if (list.length == 0) {
                list.push({ name: "No Records Found", _links: [] });
                node = makeNode(list.shift(), hasFakechild);

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

             while (list !== null && list.length) {
               
                // debugger;
                node = makeNode(list.shift(), hasFakechild);
                
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
  
            if (parent !== null) {
                return parent;
            } else {
                return nodes;
            }
        } 
        
    return self;
}
    
  
  