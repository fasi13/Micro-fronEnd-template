var app = angular.module('changePasswordModule', []);

app.controller('change-password', function ($scope, $state, $http, apiService, serviceEndpoint, $cookies) {
    $scope.oldPasswordError = "";
    $scope.currentPassword = "";
    $scope.newPassword = "";
    $scope.confirmPassword = "";
    var currentUser = JSON.parse($cookies.get('profile'));
    var _token = JSON.parse($cookies.get('profile'))._token;
    var userId = currentUser.data.data.id;
    $scope.changePasswordRequestUrl = const_APIUrl + "/users/" + userId + "/password";
    var vm = this;
    $scope.updatePassword = function () {

        var requestObject =
            {
                oldPassword: $scope.vm.currentPassword.trim(),
                newPassword: $scope.vm.confirmPassword.trim()
            };
        apiService._put($http, $scope.changePasswordRequestUrl,
         requestObject, {
             "Authorization": _token,
             "Content-type": "application/json"
         })
        .then(function (response) {
            $scope.success = "Password Changed Successfully";

            $scope.vm = {};
            $scope.changePassword.$submitted = false;
            $scope.newPasswordError = $scope.oldPasswordError = undefined;
            setTimeout(function () {

                $scope.success = undefined;

            }, 3000);

        },

        function (error) {
            // console.log(error);

            if (error.data.fields.newPassword != undefined) {
                $scope.newPasswordError = error.data.fields.newPassword.toString().trim();

                //setTimeout(function () {

                //    $scope.error = undefined;

                //}, 7000);
            }
            if (error.data.fields.oldPassword != undefined) {
                $scope.oldPasswordError = error.data.fields.oldPassword.toString().trim();

                //setTimeout(function () {

                //    $scope.oldPasswordError = undefined;

                //}, 7000)
            }



        });
    };
});

(function () {
    "use strict";

    app.directive('compareTo', compareTo);

    compareTo.$inject = [];

    function compareTo() {

        return {
            require: "ngModel",
            scope: {
                compareTolValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {

                    return modelValue == scope.compareTolValue;
                };

                scope.$watch("compareTolValue", function () {
                    ngModel.$validate();
                });
            }
        };
    }
})();
