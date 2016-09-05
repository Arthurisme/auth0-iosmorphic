angular.module('app').controller('LoginCtrl', function ($scope, auth, toastr) {
  toastr.info("Please log in", "Welcome");
  $scope.auth = auth;
  auth.signin({
    authParams: {
      scope: 'openid roles user_id name nickname email picture'
    }
  });
});
