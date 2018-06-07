var app = angular.module('apiservice', []);

app.factory('apiService', apiService);

apiService.$inject = ['$q', '$rootScope', '$http'];

function apiService($q, $rootScope, $http) {
    var self = this;

    self.get = function (url, success, failurem, token) {




        return self._get($http, url,
            {
                "Authorization": token
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
        self._get($http, url,
            {
                "Authorization": token
        }).then(function (result) {

            var _data = [];
            var results = result.data.data.items;
            for (var i = 0, len = results.length; i < len; i++) {
                _data[i] = results[i];
            }
            deferred.resolve(_data);
        }, function () {
            deferred.reject(arguments);
        });
        return deferred.promise;
    }

    self._get = function ($http, APIEndpoint, headers) {
        return $http({
            method: 'GET',
            url: APIEndpoint,
            headers: headers,
            beforeSend: function () {
                $rootScope.$broadcast('updateSessionTimeOutCount');
            }
        });
    }

    self._put = function ($http, APIEndpoint, requestData, headers) {
        return $http({
            method: 'PUT',
            url: APIEndpoint,
            data: requestData,
            headers: headers,
            beforeSend: function () {
                $rootScope.$broadcast('updateSessionTimeOutCount');
            }
        });
    }

    self._post = function ($http, APIEndpoint, requestData, headers) {
        return $http({
            method: 'POST',
            url: APIEndpoint,
            data: requestData,
            headers: headers,
            beforeSend: function () {
                $rootScope.$broadcast('updateSessionTimeOutCount');
            }
        });
    }

    return self;
}
