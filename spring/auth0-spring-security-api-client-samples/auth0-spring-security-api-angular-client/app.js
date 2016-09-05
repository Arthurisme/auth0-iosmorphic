angular.module('app', [
  'auth0',
  'ngRoute',
  'ngAnimate',
  'toastr',
  'services',
  'home',
  'angular-storage',
  'angular-jwt'
])
  .config(function myAppConfig($routeProvider, authProvider, $httpProvider, $locationProvider, jwtInterceptorProvider) {
    $routeProvider
      .when('/', {
        controller: 'LoginCtrl',
        templateUrl: 'login/login.html',
        pageTitle: 'Login'
      })
      .when('/login', {
        controller: 'LoginCtrl',
        templateUrl: 'login/login.html',
        pageTitle: 'Login'
      })
      .when('/home', {
        controller: 'HomeCtrl',
        templateUrl: 'home/home.html',
        pageTitle: 'Homepage',
        requiresLogin: true
      });

    authProvider.init({
      domain: AUTH0_DOMAIN,
      clientID: AUTH0_CLIENT_ID,
      loginUrl: '/login'
    });

    authProvider.on('loginSuccess', function ($location, profilePromise, idToken, store) {
      console.log("Login Success");
      profilePromise.then(function (profile) {
        store.set('profile', profile);
        store.set('token', idToken);
      });
      $location.path('/home');
    });

    authProvider.on('loginFailure', function () {
      console.log("Error");
    });

    authProvider.on('authenticated', function () {
      console.log("Authenticated");
    });

    jwtInterceptorProvider.tokenGetter = function (store, config, auth, jwtHelper) {
      if (DELEGATION_ENABLED && config.url.indexOf(API_SERVER_URL) === 0) {
        // does Auth0 delegation lookup
        var fetchDelegationTokenFromAuth0 = function () {
          return auth.getToken({
            targetClientId: targetClientId,
            scope: 'openid roles',
            api_type: 'app'
          }).then(function (delegation) {
            store.set('delegationToken', delegation.id_token);
            return delegation.id_token;
          });
        };
        var targetClientId = API_SERVER_CLIENT_ID;
        var delegationToken = store.get('delegationToken');
        if (delegationToken && !jwtHelper.isTokenExpired(delegationToken)) {
          // use cached delegation token
          return delegationToken;
        } else {
          return fetchDelegationTokenFromAuth0();
        }
      } else {
        // just obtain authentication token for this Client App
        return store.get('token');
      }
    };
    $httpProvider.interceptors.push('jwtInterceptor');

  }).run(function ($rootScope, auth, store, jwtHelper, $location) {
  $rootScope.$on('$locationChangeStart', function () {
    var token = store.get('token');
    if (token) {
      if (!jwtHelper.isTokenExpired(token)) {
        if (!auth.isAuthenticated) {
          auth.authenticate(store.get('profile'), token);
        }
      } else {
        $location.path('/login');
      }
    }
  });
})
  .controller('AppCtrl', function AppCtrl($scope, $location) {
    $scope.$on('$routeChangeSuccess', function (e, nextRoute) {
      if (nextRoute.$$route && angular.isDefined(nextRoute.$$route.pageTitle)) {
        $scope.pageTitle = nextRoute.$$route.pageTitle + ' | Auth0 API Client';
      }
      // handle empty case
      if (nextRoute.$$route && nextRoute.$$route.redirectTo === '/') {
        $location.path('/login');
      }
    });
  });
