angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('login', {
    url: '/main',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('signUp', {
    url: '/signup',
    templateUrl: 'templates/signUp.html',
    controller: 'signUpCtrl'
  })

  .state('process', {
    url: '/process',
    templateUrl: 'templates/process.html',
    controller: 'processCtrl'
  })

  .state('process1', {
    url: '/process1',
    templateUrl: 'templates/process1.html',
    controller: 'process1Ctrl'
  })

  .state('process2', {
    url: '/process2',
    templateUrl: 'templates/process2.html',
    controller: 'process2Ctrl'
  })

  .state('process3', {
    url: '/process3',
    templateUrl: 'templates/process3.html',
    controller: 'process3Ctrl'
  })

  .state('dashboard', {
    url: '/dashboard',
    templateUrl: 'templates/dashboard.html',
    controller: 'dashboardCtrl'
  })

$urlRouterProvider.otherwise('/main')

  

});