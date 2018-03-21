var app = angular.module('apiservice', []);

app.factory('apiService', apiService);

apiService.$inject = ['$q', '$http'];

function apiService($q, $http) {
    var self = this;

    self.get = function (url, success, failurem, token) {




        return $http.get(url, {
            headers: {
                "Authorization": token
            }
        }).then(function (result) {
            success(result);
        }, function (error) {
            if (failure !== null) {
                failure(error);
            }
        });
    }
    self.getBrandingData = function (url, token) {
        var deferred = $q.defer();
        $http.get(url, {
            headers: {
                "Authorization": token
            }
        }).then(function (result) {

            var _data = {};
            var results = result.data.data.items;
            for (var i = 0, len = results.length; i < len; i++) {
                _data[results[i]] = results[i];
            }
            deferred.resolve(_data);
        }, function () {
            deferred.reject(arguments);
        });
        return deferred.promise;
    }
    return self;
}
