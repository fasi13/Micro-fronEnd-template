var app = angular.module("sessionLogoutModule", [])
.controller('SessionLogoutCtrl', function ($scope, $uibModalInstance, $state) {
    $scope.logout = function () {
        $uibModalInstance.close();
        $state.go('sign-in');
    };
})