var app = angular.module('apiservice',[]);

app.factory('apiService', apiService);

apiService.$inject = ['$http'];

function apiService($http) { 
     var self =this;

  self.get= function(url, success, failurem,token) { 
   
    
 
    
    return  $http.get(url, {
                headers: {
                    "Authorization": token
                }
            }).then(function(result) {
        success(result);
    }, function (error) {
        if (failure !== null) {
            failure(error);
        }
    });
  }

  return self;
}