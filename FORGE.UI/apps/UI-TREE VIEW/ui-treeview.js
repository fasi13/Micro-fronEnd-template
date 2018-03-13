
/**
 * The iVantage Treeview module
 *
 * @package ivh.treeview
 */

angular.module('ivh.treeview', []);


/**
 * Supports non-default interpolation symbols
 *
 * @package ivh.treeview
 * @copyright 2016 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').constant('ivhTreeviewInterpolateEndSymbol', '}}');



/**
 * Supports non-default interpolation symbols
 *
 * @package ivh.treeview
 * @copyright 2016 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').constant('ivhTreeviewInterpolateStartSymbol', '{{');




/**
 * The recursive step, output child nodes for the scope node
 *
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').directive('ivhTreeviewChildren', function () {
    'use strict';
    return {
        restrict: 'AE',
        require: '^ivhTreeviewNode',
        template: [
          '<ul ng-if="getChildren().length" class="ivh-treeview">',
            '<li ng-repeat="child in getChildren() track by child.unique" ',

                'ng-class="{\'ivh-treeview-node ivh-treeview-node-collapsed\': !trvw.isExpanded(child) && !trvw.isLeaf(child)}"',
                'ivh-treeview-node="child" id="{{child.unique}}"',

                'ivh-treeview-depth="childDepth">',
            '</li>',
          '</ul>'
        ].join('\n')
    };
});



/**
 * Treeview tree node directive
 *
 * @private
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').directive('ivhTreeviewNode', ['ivhTreeviewCompiler', function (ivhTreeviewCompiler) {
    'use strict';
    return {
        restrict: 'A',
        scope: {
            node: '=ivhTreeviewNode',
            depth: '=ivhTreeviewDepth'
        },
        require: '^ivhTreeview',
        compile: function (tElement) {
            return ivhTreeviewCompiler
              .compile(tElement, function (scope, element, attrs, trvw) {

                  var node = scope.node;

                  var getChildren = scope.getChildren = function () {
                      return trvw.children(node);
                  };

                  scope.trvw = trvw;
                  scope.childDepth = scope.depth + 1;

                  // Expand/collapse the node as dictated by the expandToDepth property.
                  // Note that we will respect the expanded state of this node if it has
                  // been expanded by e.g. `ivhTreeviewMgr.expandTo` but not yet
                  // rendered.
                  if (!trvw.isExpanded(node)) {
                      trvw.expand(node, trvw.isInitiallyExpanded(scope.depth));
                  }

                  /**
                   * @todo Provide a way to opt out of this
                   */
                  scope.$watch(function () {
                      return getChildren().length > 0;
                  }, function (newVal) {
                      if (newVal) {
                          element.removeClass('ivh-treeview-node-leaf');
                      } else {
                          element.addClass('ivh-treeview-node-leaf');
                      }
                  });
              });
        }
    };
}]);



/**
 * Toggle logic for treeview nodes
 *
 * Handles expand/collapse on click. Does nothing for leaf nodes.
 *
 * @private
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').directive('ivhTreeviewToggle', [function () {
    'use strict';
    return {
        restrict: 'A',
        require: '^ivhTreeview',
        link: function (scope, element, attrs, trvw) {
            var node = scope.node;

            element.addClass('ivh-treeview-toggle');




            element.bind('click', function () {



                if (!trvw.isLeaf(node)) {

                    scope.$apply(function () {
                        trvw.toggleExpanded(node);
                        trvw.onToggle(node);

                    });
                }
            });
        }
    };
}]);


/**
 * Treeview twistie directive
 *
 * @private
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').directive('ivhTreeviewTwistie', ['$compile', 'ivhTreeviewOptions', function ($compile, ivhTreeviewOptions) {
    'use strict';

    var globalOpts = ivhTreeviewOptions();

    return {
        restrict: 'A',
        require: '^ivhTreeview',
        template: [

            '<span class="ivh-treeview-twistie-collapsed">',
              globalOpts.twistieCollapsedTpl,
            '</span>',
            '<span class="ivh-treeview-twistie-expanded">',
              globalOpts.twistieExpandedTpl,
            '</span>',
            '<span class="ivh-treeview-twistie-leaf">',
              globalOpts.twistieLeafTpl,
            '</span>'

        ].join('\n'),
        link: function (scope, element, attrs, trvw) {

            if (!trvw.hasLocalTwistieTpls) {
                return;
            }

            var opts = trvw.opts()
              , $twistieContainers = element
                .children().eq(0) // Template root
                .children(); // The twistie spans

            angular.forEach([
              // Should be in the same order as elements in template
              'twistieCollapsedTpl',
              'twistieExpandedTpl',
              'twistieLeafTpl'
            ], function (tplKey, ix) {
                var tpl = opts[tplKey]
                  , tplGlobal = globalOpts[tplKey];

                // Do nothing if we don't have a new template
                if (!tpl || tpl === tplGlobal) {
                    return;
                }

                // Super gross, the template must actually be an html string, we won't
                // try too hard to enforce this, just don't shoot yourself in the foot
                // too badly and everything will be alright.
                if (tpl.substr(0, 1) !== '<' || tpl.substr(-1, 1) !== '>') {
                    tpl = '<span>' + tpl + '</span>';
                }

                var $el = $compile(tpl)(scope)
                  , $container = $twistieContainers.eq(ix);

                // Clean out global template and append the new one
                $container.html('').append($el);
            });

        }
    };
}]);



angular.module('ivh.treeview').directive('ivhTreeview', ['ivhTreeviewMgr', function (ivhTreeviewMgr) {
    'use strict';
    return {
        restrict: 'A',
        transclude: true,
        scope: {
            // The tree data store
            root: '=ivhTreeview',

            // Specific config options
            childrenAttribute: '=ivhTreeviewChildrenAttribute',


            expandToDepth: '=ivhTreeviewExpandToDepth',


            expandedAttribute: '=ivhTreeviewExpandedAttribute',
            labelAttribute: '=ivhTreeviewLabelAttribute',
            nodeTpl: '=ivhTreeviewNodeTpl',


            onToggle: '&ivhTreeviewOnToggle',
            twistieCollapsedTpl: '=ivhTreeviewTwistieCollapsedTpl',
            twistieExpandedTpl: '=ivhTreeviewTwistieExpandedTpl',
            twistieLeafTpl: '=ivhTreeviewTwistieLeafTpl',


            // Generic options object
            userOptions: '=ivhTreeviewOptions',

            // The filter
            filter: '=ivhTreeviewFilter'
        },
        controllerAs: 'trvw',
        controller: ['$scope', '$element', '$attrs', '$transclude', 'ivhTreeviewOptions', 'filterFilter', 'share_data', 'share_parent', '$rootScope', 'update_breadcrumbs', function ($scope, $element, $attrs, $transclude, ivhTreeviewOptions, filterFilter, share_data, share_parent, $rootScope, update_breadcrumbs) {
            var ng = angular
              , trvw = this;


            // Merge any locally set options with those registered with hte
            // ivhTreeviewOptions provider
            var localOpts = ng.extend({}, ivhTreeviewOptions(), $scope.userOptions);

            // Two-way bound attributes (=) can be copied over directly if they're
            // non-empty
            ng.forEach([
              'childrenAttribute',


              'expandToDepth',


              'expandedAttribute',
              'labelAttribute',
              'nodeTpl',

              'twistieCollapsedTpl',
              'twistieExpandedTpl',
              'twistieLeafTpl'
            ], function (attr) {
                if (ng.isDefined($scope[attr])) {
                    localOpts[attr] = $scope[attr];
                }
            });

            // Attrs with the `&` prefix will yield a defined scope entity even if
            // no value is specified. We must check to make sure the attribute string
            // is non-empty before copying over the scope value.
            var normedAttr = function (attrKey) {
                return 'ivhTreeview' +
                  attrKey.charAt(0).toUpperCase() +
                  attrKey.slice(1);
            };

            ng.forEach([

              'onToggle'
            ], function (attr) {
                if ($attrs[normedAttr(attr)]) {
                    localOpts[attr] = $scope[attr];
                }
            });

            // Treat the transcluded content (if there is any) as our node template
            var transcludedScope;
            $transclude(function (clone, scope) {
                var transcludedNodeTpl = '';
                angular.forEach(clone, function (c) {
                    transcludedNodeTpl += (c.innerHTML || '').trim();
                });
                if (transcludedNodeTpl.length) {
                    transcludedScope = scope;
                    localOpts.nodeTpl = transcludedNodeTpl;
                }
            });

            /**
             * Get the merged global and local options
             *
             * @return {Object} the merged options
             */
            trvw.opts = function () {
                return localOpts;
            };

            // If we didn't provide twistie templates we'll be doing a fair bit of
            // extra checks for no reason. Let's just inform down stream directives
            // whether or not they need to worry about twistie non-global templates.
            var userOpts = $scope.userOptions || {};

            /**
             * Whether or not we have local twistie templates
             *
             * @private
             */
            trvw.hasLocalTwistieTpls = !!(
              userOpts.twistieCollapsedTpl ||
              userOpts.twistieExpandedTpl ||
              userOpts.twistieLeafTpl ||
              $scope.twistieCollapsedTpl ||
              $scope.twistieExpandedTpl ||
              $scope.twistieLeafTpl);

            /**
             * Get the child nodes for `node`
             *
             * Abstracts away the need to know the actual label attribute in
             * templates.
             *
             * @param {Object} node a tree node
             * @return {Array} the child nodes
             */
            trvw.children = function (node) {
                var children = node[localOpts.childrenAttribute];
                return ng.isArray(children) ? children : [];
            };

            /**
             * Get the label for `node`
             *
             * Abstracts away the need to know the actual label attribute in
             * templates.
             *
             * @param {Object} node A tree node
             * @return {String} The node label
             */
            trvw.check = function (node) {

                if (node.label == "No Records Found") {

                    return false;
                }
                else
                    return true;
            };


            trvw.check_loading = function (node) {

                if (node.label == "Loading...") {

                    return false;
                }
                else
                    return true;
            };
            trvw.share = function (method, node) {



                share_data.get_data(node);
                share_data.get_op(method);

                share_data.get_root(trvw.root());

            }
            trvw.label = function (node) {

                return node[localOpts.labelAttribute];
            };
            trvw.update_brdcms = function (node, el) {
                var currentNodeIsAppGroup = false;
                if (node.parent != null) {
                    currentNodeIsAppGroup = node.IsApplicationGroup;
                }
                if (currentNodeIsAppGroup) {
                    return; // no need to disable the configure button
                }
                else {
                    angular.element('.ivh-treeview-node-label').removeClass("selected");
                    angular.element(el).addClass("selected");
                    update_breadcrumbs.set_text(node, trvw.root());
                    angular.element(document.getElementById('configureBtn'))[0].disabled = false;
                }
            };

            $scope.$on('parentChanged', function () {



                $scope.root = share_parent.parent;




            });

            trvw.alt_title_add = function (node) {
                var name = "";

                if (node._links) {
                    var links = node._links;
                    for (var i = 0; i < links.length; i++) {

                        if (links[i].rel == "applications") {

                            name = "Application";
                        }
                        if (links[i].rel == "applicationGroups") {

                            name = "Application Group";
                        }
                    }

                }

                return name;


            };
            trvw.alt_title_edit = function (node) {
                var name = "";

                if (node._links) {
                    var links = node._links;
                    for (var i = 0; i < links.length; i++) {

                        if (links[i].rel == "applications") {

                            name = "Application Group";
                        }
                        if (links[i].rel == "applicationGroups") {

                            name = "Application";
                        }
                    }

                }

                return name;


            };


            trvw.check_add = function (node) {
                var find = false;

                if (node._links) {
                    var links = node._links;
                    for (var i = 0; i < links.length; i++) {

                        if (links[i].rel == "createApplicationGroup" || links[i].rel == "createApplication") {

                            find = true;
                            break;
                        }
                    }

                }
                return find;

            };
            trvw.check_create_app_group = function (node) {

                var find = false;

                if (node._links) {
                    var links = node._links;
                    var app_rel;
                    for (var i = 0; i < links.length; i++) {

                        if (links[i].rel == "applications") {

                            app_rel = links[i].rel;
                            break;
                        }
                    }
                    for (var i = 0; i < links.length; i++) {

                        if (links[i].rel == "createApplicationGroup" && app_rel == "applications") {

                            find = true;
                            break;
                        }
                    }

                }
                return find;


            };


            trvw.check_edit = function (node) {
                var find = false;

                if (node._links) {
                    var links = node._links;
                    for (var i = 0; i < links.length; i++) {

                        if (links[i].rel == "updateApplication" || links[i].rel == "updateApplicationGroup") {

                            find = true;
                            break;
                        }
                    }

                }
                return find;

            };

            trvw.check_app_group = function (node) {
                var find = false;

                if (node._links) {
                    var links = node._links;
                    for (var i = 0; i < links.length; i++) {

                        if (links[i].rel == "applications") {

                            find = true;
                            break;
                        }
                    }

                }
                return find;

            };
            trvw.value = function (node) {

                if (node.value) {

                    return node.value;
                }
                else
                    return false;
            };
            /**
             * Returns `true` if this treeview has a filter
             *
             * @return {Boolean} Whether on not we have a filter
             * @private
             */
            trvw.hasFilter = function () {
                return ng.isDefined($scope.filter);
            };

            /**
             * Get the treeview filter
             *
             * @return {String} The filter string
             * @private
             */
            trvw.getFilter = function () {
                return $scope.filter || '';
            };

            /**
             * Returns `true` if current filter should hide `node`, false otherwise
             *
             * @todo Note that for object and function filters each node gets hit with
             * `isVisible` N-times where N is its depth in the tree. We may be able to
             * optimize `isVisible` in this case by:
             *
             * - On first call to `isVisible` in a given digest cycle walk the tree to
             *   build a flat array of nodes.
             * - Run the array of nodes through the filter.
             * - Build a map (`id`/$scopeId --> true) for the nodes that survive the
             *   filter
             * - On subsequent calls to `isVisible` just lookup the node id in our
             *   map.
             * - Clean the map with a $timeout (?)
             *
             * In theory the result of a call to `isVisible` could change during a
             * digest cycle as scope variables are updated... I think calls would
             * happen bottom up (i.e. from "leaf" to "root") so that might not
             * actually be an issue. Need to investigate if this ends up feeling for
             * large/deep trees.
             *
             * @param {Object} node A tree node
             * @return {Boolean} Whether or not `node` is filtered out
             */
            trvw.isVisible = function (node) {
                var filter = trvw.getFilter();

                // Quick shortcut
                if (!filter || filterFilter([node], filter).length) {
                    return true;
                }

                // If we have an object or function filter we have to check children
                // separately
                if (typeof filter === 'object' || typeof filter === 'function') {
                    var children = trvw.children(node);
                    // If any child is visible then so is this node
                    for (var ix = children.length; ix--;) {
                        if (trvw.isVisible(children[ix])) {
                            return true;
                        }
                    }
                }

                return false;
            };


            /**
             * Select or deselect `node`
             *
             * Updates parent and child nodes appropriately, `isSelected` defaults to
             * `true`.
             *
             * @param {Object} node The node to select or deselect
             * @param {Boolean} isSelected Defaults to `true`
             */
            trvw.select = function (node, isSelected) {
                ivhTreeviewMgr.select($scope.root, node, localOpts, isSelected);

            };

            /**
             * Get the selected state of `node`
             *
             * @param {Object} node The node to get the selected state of
             * @return {Boolean} `true` if `node` is selected
             */
            trvw.isSelected = function (node) {

                return node[localOpts.selectedAttribute];
            };

            /**
             * Toggle the selected state of `node`
             *
             * Updates parent and child node selected states appropriately.
             *
             * @param {Object} node The node to update
             */
            trvw.toggleSelected = function (node) {

                var isSelected = !node[localOpts.selectedAttribute];
                trvw.select(node, isSelected);
            };

            /**
             * Expand or collapse a given node
             *
             * `isExpanded` is optional and defaults to `true`.
             *
             * @param {Object} node The node to expand/collapse
             * @param {Boolean} isExpanded Whether to expand (`true`) or collapse
             */
            trvw.expand = function (node, isExpanded) {
                ivhTreeviewMgr.expand($scope.root, node, localOpts, isExpanded);
            };

            /**
             * Get the expanded state of a given node
             *
             * @param {Object} node The node to check the expanded state of
             * @return {Boolean}
             */
            trvw.isExpanded = function (node) {

                return node[localOpts.expandedAttribute];
            };

            /**
             * Toggle the expanded state of a given node
             *
             * @param {Object} node The node to toggle
             */
            trvw.toggleExpanded = function (node) {
                trvw.expand(node, !trvw.isExpanded(node));
            };

            /**
             * Whether or not nodes at `depth` should be expanded by default
             *
             * Use -1 to fully expand the tree by default.
             *
             * @param {Integer} depth The depth to expand to
             * @return {Boolean} Whether or not nodes at `depth` should be expanded
             * @private
             */
            trvw.isInitiallyExpanded = function (depth) {

                var expandTo = localOpts.expandToDepth === -1 ?
                    Infinity : localOpts.expandToDepth;
                return depth < expandTo;
            };

            /**
             * Returns `true` if `node` is a leaf node
             *
             * @param {Object} node The node to check
             * @return {Boolean} `true` if `node` is a leaf
             */
            trvw.isLeaf = function (node) {
                return trvw.children(node).length === 0;
            };

            /**
             * Get the tree node template
             *
             * @return {String} The node template
             * @private
             */
            trvw.getNodeTpl = function () {

                return localOpts.nodeTpl;
            };

            /**
             * Get the root of the tree
             *
             * Mostly a helper for custom templates
             *
             * @return {Object|Array} The tree root
             * @private
             */
            trvw.root = function () {
                return $scope.root;
            };

            /**
             * Call the registered toggle handler
             *
             * Handler will get a reference to `node` and the root of the tree.
             *
             * @param {Object} node Tree node to pass to the handler
             * @private
             */
            trvw.onToggle = function (node) {
                if (localOpts.onToggle) {
                    var locals = {
                        ivhNode: node,
                        ivhIsExpanded: trvw.isExpanded(node),
                        ivhTree: $scope.root
                    };
                    localOpts.onToggle(locals);
                }
            };

            /**
             * Call the registered selection change handler
             *
             * Handler will get a reference to `node`, the new selected state of
             * `node, and the root of the tree.
             *
             * @param {Object} node Tree node to pass to the handler
             * @param {Boolean} isSelected Selected state for `node`
             * @private
             */

        }],

        link: function (scope, element, attrs) {
            var opts = scope.trvw.opts();


        },
        template: [
          '<ul class="ivh-treeview">',
            '<li ng-repeat="child in root | ivhTreeviewAsArray " ',

                'ng-class="{\'ivh-treeview-node ivh-treeview-node-collapsed\': !trvw.isExpanded(child) && !trvw.isLeaf(child)}" ',
                'ivh-treeview-node="child" id="{{child.unique}}"',
                'ivh-treeview-depth="0">',
            '</li>',
          '</ul>'
        ].join('\n')
    };
}]);


angular.module('ivh.treeview').filter('ivhTreeviewAsArray', function () {
    'use strict';
    return function (arr) {

        if (!angular.isArray(arr) && angular.isObject(arr)) {

            return [arr];
        }
        return arr;
    };
});


/**
 * Breadth first searching for treeview data stores
 *
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').factory('ivhTreeviewBfs', ['ivhTreeviewOptions', function (ivhTreeviewOptions) {
    'use strict';

    var ng = angular;

    /**
     * Breadth first search of `tree`
     *
     * `opts` is optional and may override settings from `ivhTreeviewOptions.options`.
     * The callback `cb` will be invoked on each node in the tree as we traverse,
     * if it returns `false` traversal of that branch will not continue. The
     * callback is given the current node as the first parameter and the node
     * ancestors, from closest to farthest, as an array in the second parameter.
     *
     * @param {Array|Object} tree The tree data
     * @param {Object} opts [optional] Settings overrides
     * @param {Function} cb [optional] Callback to run against each node
     */
    return function (tree, opts, cb) {
        if (arguments.length === 2 && ng.isFunction(opts)) {
            cb = opts;
            opts = {};
        }
        opts = angular.extend({}, ivhTreeviewOptions(), opts);
        cb = cb || ng.noop;

        var queue = []
          , childAttr = opts.childrenAttribute
          , next, node, parents, ix, numChildren;

        if (ng.isArray(tree)) {
            ng.forEach(tree, function (n) {
                // node and parents
                queue.push([n, []]);
            });
            next = queue.shift();
        } else {
            // node and parents
            next = [tree, []];
        }

        while (next) {
            node = next[0];
            parents = next[1];
            // cb might return `undefined` so we have to actually check for equality
            // against `false`
            if (cb(node, parents) !== false) {
                if (node[childAttr] && ng.isArray(node[childAttr])) {
                    numChildren = node[childAttr].length;
                    for (ix = 0; ix < numChildren; ix++) {
                        queue.push([node[childAttr][ix], [node].concat(parents)]);
                    }
                }
            }
            next = queue.shift();
        }
    };
}]);


/**
 * Compile helper for treeview nodes
 *
 * Defers compilation until after linking parents. Otherwise our treeview
 * compilation process would recurse indefinitely.
 *
 * Thanks to http://stackoverflow.com/questions/14430655/recursion-in-angular-directives
 *
 * @private
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').factory('ivhTreeviewCompiler', ['$compile', function ($compile) {
    'use strict';
    return {
        /**
         * Manually compiles the element, fixing the recursion loop.
         * @param {Object} element The angular element or template
         * @param {Function} link [optional] A post-link function, or an object with function(s) registered via pre and post properties.
         * @returns An object containing the linking functions.
         */
        compile: function (element, link) {
            // Normalize the link parameter
            if (angular.isFunction(link)) {
                link = { post: link };
            }

            var compiledContents;
            return {
                pre: (link && link.pre) ? link.pre : null,
                /**
                 * Compiles and re-adds the contents
                 */
                post: function (scope, element, attrs, trvw) {
                    // Compile our template
                    if (!compiledContents) {
                        compiledContents = $compile(trvw.getNodeTpl());
                    }
                    // Add the compiled template
                    compiledContents(scope, function (clone) {
                        element.append(clone);
                    });

                    // Call the post-linking function, if any
                    if (link && link.post) {
                        link.post.apply(null, arguments);
                    }
                }
            };
        }
    };
}]);


/**
 * Manager for treeview data stores
 *
 * Used to assist treeview operations, e.g. selecting or validating a tree-like
 * collection.
 *
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview')
  .factory('ivhTreeviewMgr', ['ivhTreeviewOptions', 'ivhTreeviewBfs', function (ivhTreeviewOptions, ivhTreeviewBfs) {
      'use strict';

      var ng = angular
        , options = ivhTreeviewOptions()
        , exports = {};

      // The make* methods and validateParent need to be bound to an options
      // object

      var isId = function (val) {
          return ng.isString(val) || ng.isNumber(val);
      };

      var findNode = function (tree, node, opts, cb) {
          var useId = isId(node)
            , proceed = true;


          // Our return values
          var foundNode = null
            , foundParents = [];

          ivhTreeviewBfs(tree, opts, function (n, p) {
              var isNode = proceed && (useId ?
                node === n[idAttr] :
                node === n);

              if (isNode) {
                  // I've been looking for you all my life
                  proceed = false;
                  foundNode = n;
                  foundParents = p;
              }

              return proceed;
          });

          return cb(foundNode, foundParents);
      };

      /**
       * Select (or deselect) a tree node
       *
       * This method will update the rest of the tree to account for your change.
       *
       * You may alternatively pass an id as `node`, in which case the tree will
       * be searched for your item.
       *
       * @param {Object|Array} tree The tree data
       * @param {Object|String} node The node (or id) to (de)select
       * @param {Object} opts [optional] Options to override default options with
       * @param {Boolean} isSelected [optional] Whether or not to select `node`, defaults to `true`
       * @return {Object} Returns the ivhTreeviewMgr instance for chaining
       */
      exports.select = function (tree, node, opts, isSelected) {
          if (arguments.length > 2) {
              if (typeof opts === 'boolean') {
                  isSelected = opts;
                  opts = {};
              }
          }
          opts = ng.extend({}, options, opts);
          isSelected = ng.isDefined(isSelected) ? isSelected : true;

          var useId = isId(node)
            , proceed = true;

          ivhTreeviewBfs(tree, opts, function (n, p) {
              var isNode = proceed && (useId ?
                node === n[idAttr] :
                node === n);

              if (isNode) {
                  // I've been looking for you all my life
                  proceed = false;

                  var cb = isSelected ?
                    makeSelected.bind(opts) :
                    makeDeselected.bind(opts);


              }

              return proceed;
          });

          return exports;
      };

      /**
       * Select all nodes in a tree
       *
       * `opts` will default to an empty object, `isSelected` defaults to `true`.
       *
       * @param {Object|Array} tree The tree data
       * @param {Object} opts [optional] Default options overrides
       * @param {Boolean} isSelected [optional] Whether or not to select items
       * @return {Object} Returns the ivhTreeviewMgr instance for chaining
       */


      /**
       * Select or deselect each of the passed items
       *
       * Eventually it would be nice if this did something more intelligent than
       * just calling `select` on each item in the array...
       *
       * @param {Object|Array} tree The tree data
       * @param {Array} nodes The array of nodes or node ids
       * @param {Object} opts [optional] Default options overrides
       * @param {Boolean} isSelected [optional] Whether or not to select items
       * @return {Object} Returns the ivhTreeviewMgr instance for chaining
       */
      exports.selectEach = function (tree, nodes, opts, isSelected) {
          /**
           * @todo Surely we can do something better than this...
           */
          ng.forEach(nodes, function (node) {
              exports.select(tree, node, opts, isSelected);
          });
          return exports;
      };

      /**
       * Deselect a tree node
       *
       * Delegates to `ivhTreeviewMgr.select` with `isSelected` set to `false`.
       *
       * @param {Object|Array} tree The tree data
       * @param {Object|String} node The node (or id) to (de)select
       * @param {Object} opts [optional] Options to override default options with
       * @return {Object} Returns the ivhTreeviewMgr instance for chaining
       */
      exports.deselect = function (tree, node, opts) {
          return exports.select(tree, node, opts, false);
      };

      /**
       * Deselect all nodes in a tree
       *
       * Delegates to `ivhTreeviewMgr.selectAll` with `isSelected` set to `false`.
       *
       * @param {Object|Array} tree The tree data
       * @param {Object} opts [optional] Default options overrides
       * @return {Object} Returns the ivhTreeviewMgr instance for chaining
       */
      exports.deselectAll = function (tree, opts) {
          return exports.selectAll(tree, opts, false);
      };

      /**
       * Deselect each of the passed items
       *
       * Delegates to `ivhTreeviewMgr.selectEach` with `isSelected` set to
       * `false`.
       *
       * @param {Object|Array} tree The tree data
       * @param {Array} nodes The array of nodes or node ids
       * @param {Object} opts [optional] Default options overrides
       * @return {Object} Returns the ivhTreeviewMgr instance for chaining
       */
      exports.deselectEach = function (tree, nodes, opts) {
          return exports.selectEach(tree, nodes, opts, false);
      };

      /**
       * Validate tree for parent/child selection consistency
       *
       * Assumes `bias` as default selected state. The first element with
       * `node.select !== bias` will be assumed correct. For example, if `bias` is
       * `true` (the default) we'll traverse the tree until we come to an
       * unselected node at which point we stop and deselect each of that node's
       * children (and their children, etc.).
       *
       * Indeterminate states will also be resolved.
       *
       * @param {Object|Array} tree The tree data
       * @param {Object} opts [optional] Options to override default options with
       * @param {Boolean} bias [optional] Default selected state
       * @return {Object} Returns the ivhTreeviewMgr instance for chaining
       */

      /**
       * Expand/collapse a given tree node
       *
       * `node` may be either an actual tree node object or a node id.
       *
       * `opts` may override any of the defaults set by `ivhTreeviewOptions`.
       *
       * @param {Object|Array} tree The tree data
       * @param {Object|String} node The node (or id) to expand/collapse
       * @param {Object} opts [optional] Options to override default options with
       * @param {Boolean} isExpanded [optional] Whether or not to expand `node`, defaults to `true`
       * @return {Object} Returns the ivhTreeviewMgr instance for chaining
       */
      exports.expand = function (tree, node, opts, isExpanded) {

          if (arguments.length > 2) {
              if (typeof opts === 'boolean') {
                  isExpanded = opts;
                  opts = {};
              }
          }
          opts = ng.extend({}, options, opts);
          isExpanded = ng.isDefined(isExpanded) ? isExpanded : true;

          var useId = isId(node)
            , expandedAttr = opts.expandedAttribute;

          if (!useId) {
              // No need to do any searching if we already have the node in hand
              node[expandedAttr] = isExpanded;
              return exports;
          }

          return findNode(tree, node, opts, function (n, p) {
              n[expandedAttr] = isExpanded;
              return exports;
          });
      };

      /**
       * Expand/collapse a given tree node and its children
       *
       * `node` may be either an actual tree node object or a node id. You may
       * leave off `node` entirely to expand/collapse the entire tree, however, if
       * you specify a value for `opts` or `isExpanded` you must provide a value
       * for `node`.
       *
       * `opts` may override any of the defaults set by `ivhTreeviewOptions`.
       *
       * @param {Object|Array} tree The tree data
       * @param {Object|String} node [optional*] The node (or id) to expand/collapse recursively
       * @param {Object} opts [optional] Options to override default options with
       * @param {Boolean} isExpanded [optional] Whether or not to expand `node`, defaults to `true`
       * @return {Object} Returns the ivhTreeviewMgr instance for chaining
       */
      exports.expandRecursive = function (tree, node, opts, isExpanded) {
          if (arguments.length > 2) {
              if (typeof opts === 'boolean') {
                  isExpanded = opts;
                  opts = {};
              }
          }
          node = ng.isDefined(node) ? node : tree;
          opts = ng.extend({}, options, opts);
          isExpanded = ng.isDefined(isExpanded) ? isExpanded : true;

          var useId = isId(node)
            , expandedAttr = opts.expandedAttribute
            , branch;

          // If we have an ID first resolve it to an actual node in the tree
          if (useId) {
              findNode(tree, node, opts, function (n, p) {
                  branch = n;
              });
          } else {
              branch = node;
          }

          if (branch) {
              ivhTreeviewBfs(branch, opts, function (n, p) {
                  n[expandedAttr] = isExpanded;
              });
          }

          return exports;
      };

      /**
       * Collapse a given tree node
       *
       * Delegates to `exports.expand` with `isExpanded` set to `false`.
       *
       * @param {Object|Array} tree The tree data
       * @param {Object|String} node The node (or id) to collapse
       * @param {Object} opts [optional] Options to override default options with
       * @return {Object} Returns the ivhTreeviewMgr instance for chaining
       */
      exports.collapse = function (tree, node, opts) {
          return exports.expand(tree, node, opts, false);
      };

      /**
       * Collapse a given tree node and its children
       *
       * Delegates to `exports.expandRecursive` with `isExpanded` set to `false`.
       *
       * @param {Object|Array} tree The tree data
       * @param {Object|String} node The node (or id) to expand/collapse recursively
       * @param {Object} opts [optional] Options to override default options with
       * @return {Object} Returns the ivhTreeviewMgr instance for chaining
       */
      exports.collapseRecursive = function (tree, node, opts, isExpanded) {
          return exports.expandRecursive(tree, node, opts, false);
      };

      /**
       * Expand[/collapse] all parents of a given node, i.e. "reveal" the node
       *
       * @param {Object|Array} tree The tree data
       * @param {Object|String} node The node (or id) to expand to
       * @param {Object} opts [optional] Options to override default options with
       * @param {Boolean} isExpanded [optional] Whether or not to expand parent nodes
       * @return {Object} Returns the ivhTreeviewMgr instance for chaining
       */
      exports.expandTo = function (tree, node, opts, isExpanded) {
          if (arguments.length > 2) {
              if (typeof opts === 'boolean') {
                  isExpanded = opts;
                  opts = {};
              }
          }
          opts = ng.extend({}, options, opts);
          isExpanded = ng.isDefined(isExpanded) ? isExpanded : true;

          var expandedAttr = opts.expandedAttribute;

          var expandCollapseNode = function (n) {
              n[expandedAttr] = isExpanded;
          };

          // Even if wer were given the actual node and not its ID we must still
          // traverse the tree to find that node's parents.
          return findNode(tree, node, opts, function (n, p) {
              ng.forEach(p, expandCollapseNode);
              return exports;
          });
      };

      /**
       * Collapse all parents of a give node
       *
       * Delegates to `exports.expandTo` with `isExpanded` set to `false`.
       *
       * @param {Object|Array} tree The tree data
       * @param {Object|String} node The node (or id) to expand to
       * @param {Object} opts [optional] Options to override default options with
       * @return {Object} Returns the ivhTreeviewMgr instance for chaining
       */
      exports.collapseParents = function (tree, node, opts) {
          return exports.expandTo(tree, node, opts, false);
      };

      return exports;
  }
  ]);


/**
 * Global options for ivhTreeview
 *
 * @package ivh.treeview
 * @copyright 2014 iVantage Health Analytics, Inc.
 */

angular.module('ivh.treeview').provider('ivhTreeviewOptions', [
    'ivhTreeviewInterpolateStartSymbol', 'ivhTreeviewInterpolateEndSymbol',
    function (ivhTreeviewInterpolateStartSymbol, ivhTreeviewInterpolateEndSymbol) {
        'use strict';

        var symbolStart = ivhTreeviewInterpolateStartSymbol
          , symbolEnd = ivhTreeviewInterpolateEndSymbol;

        var options = {
            /**
             * ID attribute
             *
             * For selecting nodes by identifier rather than reference
             */


            /**
             * Collection item attribute to use for labels
             */
            labelAttribute: 'label',

            /**
             * Collection item attribute to use for child nodes
             */
            childrenAttribute: 'children',

            /**
             * Collection item attribute to use for selected state
             */
            selectedAttribute: 'selected',

            /**
             * Controls whether branches are initially expanded or collapsed
             *
             * A value of `0` means the tree will be entirely collapsd (the default
             * state) otherwise branches will be expanded up to the specified depth. Use
             * `-1` to have the tree entirely expanded.
             */
            expandToDepth: 0,




            /**
             * Whether or not directive should validate treestore on startup
             */


            /**
             * Collection item attribute to track intermediate states
             */


            /**
             * Collection item attribute to track expanded status
             */
            expandedAttribute: '__ivhTreeviewExpanded',

            /**
             * Default selected state when validating
             */


            /**
             * Template for expanded twisties
             */
            twistieExpandedTpl: '(-)',

            /**
             * Template for collapsed twisties
             */
            twistieCollapsedTpl: '(+)',

            /**
             * Template for leaf twisties (i.e. no children)
             */
            twistieLeafTpl: 'o',

            /**
             * Template for tree nodes
             */
            nodeTpl: [
              '<div class="ivh-treeview-node-content" title="{{::trvw.label(node)}}">',
              '<div ng-class="{\'row parent\':!trvw.check_app_group(node),\'row add-bg\':trvw.check_app_group(node)}" ng-init="show_icons = \'hide\'" ng-mouseenter="show_icons = \'show\'" ng-mouseleave="show_icons = \'hide\'">',

                '<div   class="cust-col nopadding">',
                '<span ivh-treeview-toggle leaf >',
                  '<span class="ivh-treeview-twistie-wrapper" ivh-treeview-twistie ng-if="trvw.check(node)"></span>',
                  '<span class="ivh-treeview-node-label" ng-if="trvw.check(node)" ng-click="trvw.update_brdcms(node,$event.currentTarget)">',
                  '{{::trvw.label(node)}} <span ng-if="trvw.value(node)">({{::trvw.value(node)}})</span>',
                '</span>',

                '</span>',

                '<span class="ivh-treeview-node-label" ng-if="!trvw.check(node)">',
                  '{{::trvw.label(node)}}',
                '</span>',

                '</div>',
                '<div ng-class="show_icons" class="nopadding cust-width" ng-if="trvw.check(node) && trvw.check_loading(node)">',
                '<div class="pull-right show-icon">',
                ' <a ng-if="trvw.check_create_app_group(node)" href="#add_ag"  ng-click="trvw.share(\'add_ag\',node); $event.preventDefault();" role="button" data-toggle="modal" title="Add Application Group"><span><img src="imgs/views-icon.png" class="glif_icon"/></span></a>',
                ' <a ng-if="trvw.check_add(node)" href="#add"  ng-click="trvw.share(\'add\',node); $event.preventDefault();" role="button" data-toggle="modal" ng-attr-title="Add {{::trvw.alt_title_add(node);}}"><span  class="glyphicon glyphicon-pencil" ></span></a>',
                ' <a ng-if="trvw.check_edit(node)" href="#edit" ng-click="trvw.share(\'edit\',node);$event.preventDefault();" role="button" data-toggle="modal"  ng-attr-title="Edit {{::trvw.alt_title_edit(node);}}"><span  class="glyphicon glyphicon-edit"></span></a>',
                '<a href="" ng-attr-title="Delete {{::trvw.alt_title_edit(node);}}"> <span  class="glyphicon glyphicon-trash"></span> </a>',
               '</div>',

               '</div>',
               '</div>',
                '<div ivh-treeview-children></div>',
              '</div>'
            ].join('\n')
            .replace(new RegExp('{{', 'g'), symbolStart)
            .replace(new RegExp('}}', 'g'), symbolEnd)
        };

        /**
         * Update global options
         *
         * @param {Object} opts options object to override defaults with
         */
        this.set = function (opts) {

            angular.extend(options, opts);
        };


        this.$get = function () {
            /**
             * Get a copy of the global options
             *
             * @return {Object} The options object
             */
            return function () {
                return angular.copy(options);
            };
        };
    }]);