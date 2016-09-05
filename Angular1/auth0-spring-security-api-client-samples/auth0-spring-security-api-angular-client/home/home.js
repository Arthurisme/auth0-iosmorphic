angular.module('home', ['auth0', 'toastr'])
.controller( 'HomeCtrl', function ($scope, auth, profileResource, toastr, $http, $location, $window, store) {

  $scope.auth = auth;

  var fetchProfileList = function (cb) {
    profileResource.query(function (data) {
      $scope.profiles = data;
      $scope.title = "Profile Info";
      if (cb !== null) {
        cb();
      }
    });
  };

  fetchProfileList(function () {
    toastr.success('Data retrieved from API Server', 'Success');
  });
  $scope.listProfiles = true;

  $scope.editProfile = function (id) {
    $scope.profile = {};
    $scope.message = '';

    profileResource.get({id: id},
      function (data) {
        $scope.profile = data;
        $scope.originalProfile = angular.copy(data);
      }, function (response) {
        $scope.message = response.statusText + "\r\n";
        if (response.data && response.data.errors !== null) {
          response.data.errors.forEach(function (error, index) {
            $scope.message += response.data.errors[index].defaultMessage + "\r\n";
          });
        }
      });

    $scope.title = "Edit Profile";
    $scope.listProfiles = false;
  };

  $scope.logout = function() {
    var homeButton = angular.element(document.querySelector('#home'));
    homeButton.removeClass('active');
    var logoutButton = angular.element(document.querySelector('#logout'));
    logoutButton.addClass('active');
    auth.signout();
    store.remove('profile');
    store.remove('delegationToken');
    store.remove('token');
    $location.path('/login');
  };


  // TODO - get, put, post, delete all defined but UI requires updating to support POST / DELETE

  $scope.submit = function () {
    $scope.message = '';
    if ($scope.profile.id) {
      $scope.profile.$update({ id: $scope.profile.id },
        function (data) {
          fetchProfileList(function () {
            toastr.success('Data updated', 'Success');
            $scope.listProfiles = true;
          });
        }, function (response) {
          $scope.message = response.statusText + "\r\n";
          if (response.data && response.data.errors !== null) {
            response.data.errors.forEach(function (error, index) {
              $scope.message += response.data.errors[index].defaultMessage + "\r\n";
            });
            toastr.error($scope.message, 'Error');
          }
        });
    }
    else {
      $scope.profile.$save(
        function (data) {
          $scope.originalProfile = angular.copy(data);
          fetchProfileList(function () {
            toastr.success('Data saved', 'Success');
            $scope.listProfiles = true;
          });
        }, function (response) {
          $scope.message = response.statusText + "\r\n";
          if (response.data && response.data.errors !== null) {
            response.data.errors.forEach(function (error, index) {
              $scope.message += response.data.errors[index].defaultMessage + "\r\n";
            });
            toastr.error($scope.message, 'Error');
          }
        });
    }
  };

  $scope.cancel = function (editForm) {
    editForm.$setPristine();
    $scope.profile = angular.copy($scope.originalProfile);
    $scope.message = "";
    fetchProfileList(function () {
      toastr.info("Edit cancelled", 'Cancel');
      $scope.listProfiles = true;
    });
  };

});
