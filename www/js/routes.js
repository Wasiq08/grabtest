angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
        .state('sidemenu', {
            url: '/sidemenu',
            templateUrl: 'templates/sidemenu.html',
            abstract: true,
            controller: 'SideMenuCtrl',
            onEnter: function($state, localStorageService) {
                if (!localStorageService.get('loggedInUser')) {
                    $state.go('login');
                }
            }
        })

    .state('sidemenu.dashboard', {
        url: '/dashboard',
        views: {
            'menuContent': {
                templateUrl: 'templates/dashboard.html',
                controller: 'dashboardCtrl'
            }
        }
    })

    .state('sidemenu.profile', {
        url: '/profile/:id',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            }
        }
    })

    .state('sidemenu.foodprofile', {
        url: '/foodprofile/:id',
        views: {
            'menuContent': {
                templateUrl: 'templates/foodprofile.html',
                controller: 'FoodProfileCtrl'
            }
        }

    })

    .state('sidemenu.imagefilter', {
        url: '/imagefilter',
        views: {
            'menuContent': {
                templateUrl: 'templates/imagefilter.html',
                controller: 'ImageFilterCtrl'
            }
        }
    })

    .state('sidemenu.createpost', {
        url: '/createpost',
        views: {
            'menuContent': {
                templateUrl: 'templates/createpost.html',
                controller: 'CreatePostCtrl'
            }
        }
    })

    .state('sidemenu.turn-on-location', {
        url: '/turn-on-location',
        views: {
            'menuContent': {
                templateUrl: 'templates/turn-on-location.html',
                controller: 'TurnLocationCtrl'
            }
        }
    })

    .state('sidemenu.map', {
        url: '/map',
        views: {
            'menuContent': {
                templateUrl: 'templates/map.html',
                controller: 'MapCtrl'
            }
        }
    })

    .state('sidemenu.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl'
            }
        }
    })

    .state('sidemenu.feedlocation', {
        url: '/feedlocation',
        views: {
            'menuContent': {
                templateUrl : 'templates/feedlocation.html',
                controller: 'FeedLocationCtrl'
            }
        }
    })

    .state('login', {
        url: '/main',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
    })

    .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signUp.html',
        controller: 'signUpCtrl'
    })

    .state('uploadimage', {
        url: '/uploadimage',
        templateUrl: 'templates/upload-image.html',
        controller: 'UploadImageCtrl'
    })

    .state('welcome', {
        url: '/welcome',
        templateUrl: 'templates/welcome.html',
        controller: 'welcomeCtrl'
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
        controller: 'process1Ctrl'
    })

    .state('process3', {
        url: '/process3',
        templateUrl: 'templates/process3.html',
        controller: 'process1Ctrl'
    })



    // $urlRouterProvider.otherwise('/main')
    //$urlRouterProvider.otherwise('/sidemenu/dashboard')

    $urlRouterProvider.otherwise('/sidemenu/dashboard')


});
