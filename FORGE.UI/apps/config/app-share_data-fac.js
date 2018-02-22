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
