var app = angular.module('app-share_data-fac', [])
    .factory('share_parent', function ($rootScope) {

        var shareObj = {};

        shareObj.parent = {};

        shareObj.get_parent = function (parent) {
            this.parent = parent;
            this.update_parent();
        };
        shareObj.update_parent = function () {
            $rootScope.$broadcast('parentChanged');
        };

        return shareObj;
    })
    .factory('share_data', function ($rootScope) {
        var shareObj = {};

        shareObj.op = '';
        shareObj.data = {}
        shareObj.root = {};

        shareObj.get_op = function (method) {
            this.op = method;
            this.broadcastItem();
        };
        shareObj.get_root = function (root) {
            this.root = root;
            this.broadcastItem();
        }


        shareObj.get_data = function (data_obj) {
            this.data = data_obj;
            this.broadcastItem();
        };
        shareObj.broadcastItem = function () {
            $rootScope.$broadcast('handleBroadcast');
        };

        return shareObj;
    })
.factory('update_breadcrumbs', function ($rootScope) {


    var shareObj = {};

    shareObj.node = {};
    shareObj.parent = {};
    shareObj.configuredNode = {};
    shareObj.configNode = function (node) {
        this.configuredNode = node;
        this.update();
    }
    shareObj.set_text = function (node, parent) {
        this.node = node;
        this.parent = parent;
        this.update();
    };
    shareObj.update = function () {
        $rootScope.$broadcast('breadcrumbsChanged');
    };

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
    shareObj.set_branding = function (getAttributeURL) {
        this.node = getAttributeURL;
        this.updateBranding();
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
