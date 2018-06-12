angular.module("ivh.treeview", []), angular.module("ivh.treeview").directive("ivhTreeviewChildren", function () {
    "use strict";
    return {
        restrict: "AE",
        require: "^ivhTreeviewNode",
        template: ['<ul ng-if="getChildren().length" class="ivh-treeview">', '<li ng-repeat="child in getChildren() track by child.unique" ',
            'ng-class="{\'ivh-treeview-node ivh-treeview-node-collapsed\': !trvw.isExpanded(child) && !trvw.isLeaf(child)}"',
            'ivh-treeview-node="child" id="{{::child.unique}}"', 'ivh-treeview-depth="childDepth">', "</li>", "</ul>"].join("\n")
    }
}), angular.module("ivh.treeview").directive("ivhTreeviewNode", function () {
    "use strict";
    return {
        restrict: "A",
        scope: {
            node: "=ivhTreeviewNode",
            depth: "=ivhTreeviewDepth"
        },
        require: "^ivhTreeview",
        compile: function (e) {
            var o;
            return {
                post: function (e, i, t, n) {
                    var r = e.node,
                        l = e.getChildren = function () {
                            return n.children(r)
                        };
                    e.trvw = n, e.childDepth = e.depth + 1, n.isExpanded(r) || n.expand(r, n.isInitiallyExpanded(e.depth)), 0 < l().length ? i.removeClass("ivh-treeview-node-leaf") : i.addClass("ivh-treeview-node-leaf"), o || (o = e.node.html),
                    o(e, function (e) {
                        i.html(e)
                    })
                }
            }
        }
    }
}), angular.module("ivh.treeview").directive("ivhTreeviewToggle", [function () {
    "use strict";
    return {
        restrict: "A",
        require: "^ivhTreeview",
        link: function (e, i, t, n) {
            var r = e.node;
            i.addClass("ivh-treeview-toggle"), i.on("click", function () {
                n.isLeaf(r) || (n.toggleExpanded(r), n.onToggle(r), e.$digest())
            })
        }
    }
}]), angular.module("ivh.treeview").directive("ivhTreeviewTwistie", function () {
    "use strict";
    return {
        restrict: "A",
        require: "^ivhTreeview",
        template: ['<span class="ivh-treeview-twistie-collapsed">', '<span class="glyphicon glyphicon-plus"></span>', "</span>", '<span class="ivh-treeview-twistie-expanded">', '<span class="glyphicon glyphicon-minus"></span>', "</span>", '<span class="ivh-treeview-twistie-leaf">', '<span class="glyphicon glyphicon-refresh load"></span>', "</span>"].join("\n"),
        link: function (e, i, t, n) {
            n.hasLocalTwistieTpls
        }
    }
}), angular.module("ivh.treeview").directive("ivhTreeview", ["ivhTreeviewMgr", function (d) {
    "use strict";
    return {
        restrict: "A",
        transclude: !0,
        scope: {
            root: "=ivhTreeview",
            childrenAttribute: "=ivhTreeviewChildrenAttribute",
            expandToDepth: "=ivhTreeviewExpandToDepth",
            expandedAttribute: "=ivhTreeviewExpandedAttribute",
            onToggle: "&ivhTreeviewOnToggle",
            twistieCollapsedTpl: "=ivhTreeviewTwistieCollapsedTpl",
            twistieExpandedTpl: "=ivhTreeviewTwistieExpandedTpl",
            twistieLeafTpl: "=ivhTreeviewTwistieLeafTpl",
            userOptions: "=ivhTreeviewOptions",
            filter: "=ivhTreeviewFilter"
        },
        controllerAs: "trvw",
        controller: ["$scope", "$attrs", "ivhTreeviewOptions", "$rootScope", "shareHierarchyData", function (t, n, e, i, r) {
            var l = angular,
                o = this,
                a = l.extend({}, e(), t.userOptions);
            l.forEach(["childrenAttribute", "expandToDepth", "expandedAttribute", "twistieCollapsedTpl", "twistieExpandedTpl", "twistieLeafTpl"], function (e) {
                l.isDefined(t[e]) && (a[e] = t[e])
            });
            l.forEach(["onToggle"], function (e) {
                var i;
                n[(i = e, "ivhTreeview" + i.charAt(0).toUpperCase() + i.slice(1))] && (a[e] = t[e])
            }), o.opts = function () {
                return a
            };
            var s = t.userOptions || {};
            o.hasLocalTwistieTpls = !!(s.twistieCollapsedTpl || s.twistieExpandedTpl || s.twistieLeafTpl || t.twistieCollapsedTpl || t.twistieExpandedTpl || t.twistieLeafTpl), o.children = function (e) {
                var i = e[a.childrenAttribute];
                return l.isArray(i) ? i : []
            }, t.$on("rootChanged", function () {
                t.root = r.root
            }), o.expand = function (e, i) {
                d.expand(t.root, e, a, i)
            }, o.isExpanded = function (e) {
                return e[a.expandedAttribute]
            }, o.toggleExpanded = function (e) {
                o.expand(e, !o.isExpanded(e))
            }, o.isInitiallyExpanded = function (e) {
                return e < (-1 === a.expandToDepth ? 1 / 0 : a.expandToDepth)
            }, o.isLeaf = function (e) {
                return 0 === o.children(e).length
            }, o.root = function () {
                return t.root
            }, o.onToggle = function (e) {
                if (a.onToggle) {
                    var i = {
                        ivhNode: e,
                        ivhIsExpanded: o.isExpanded(e),
                        ivhTree: t.root
                    };
                    a.onToggle(i)
                }
            }
        }],
        link: function (e, i, t) {
            e.trvw.opts()
        },
        template: ['<ul class="ivh-treeview">', '<li ng-repeat="child in root | ivhTreeviewAsArray " ',
            'class="{{!trvw.isExpanded(child) && !trvw.isLeaf(child)  ? \'ivh-treeview-node ivh-treeview-node-collapsed\':\'\' }}"',
            'ivh-treeview-node="child" id="{{::child.unique}}"', 'ivh-treeview-depth="0">', "</li>", "</ul>"].join("\n")
    }
}]), angular.module("ivh.treeview").filter("ivhTreeviewAsArray", function () {
    "use strict";
    return function (e) {
        return !angular.isArray(e) && angular.isObject(e) ? [e] : e
    }
}), angular.module("ivh.treeview").factory("ivhTreeviewMgr", ["ivhTreeviewOptions", function (e) {
    "use strict";
    var o = angular,
        a = e(),
        s = {},
        d = function (e) {
            return o.isString(e) || o.isNumber(e)
        };
    return s.expand = function (e, i, t, n) {
        2 < arguments.length && "boolean" == typeof t && (n = t, t = {}), t = o.extend({}, a, t), n = !o.isDefined(n) || n;
        var r = d(i),
            l = t.expandedAttribute;
        return r ? function (e, i, t, n) {
            d(i);
            return n(null, [])
        }(0, i, 0, function (e, i) {
            return e[l] = n, s
        }) : (i[l] = n, s)
    }, s
}]), angular.module("ivh.treeview").provider("ivhTreeviewOptions", function () {
    "use strict";
    var i = {
        childrenAttribute: "children",
        expandToDepth: 0,
        expandedAttribute: "__ivhTreeviewExpanded",
        twistieExpandedTpl: "(-)",
        twistieCollapsedTpl: "(+)",
        twistieLeafTpl: "o"
    };
    this.set = function (e) {
        angular.extend(i, e)
    }, this.$get = function () {
        return function () {
            return angular.copy(i)
        }
    }
});