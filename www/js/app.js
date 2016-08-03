// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ngCordova', 'ionic-datepicker', 'ngGeolocation','ion-place-tools', 'ionic.ui.modalService', 'ionic-modal-select', 'LocalStorageModule', 'ionic.contrib.ui.hscrollcards', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'CoreApi'])

.constant('_', window._)

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.run(function($rootScope, $state) {

    $rootScope.navigateState = function(state) {
        console.log("state is", state)
        $state.go(state)
    }


    $rootScope.locationAddressFix = function(place) {
        if (place == undefined) return {};

        var userLocation = {};
        var componentForm = { street_number: 'short_name', route: 'long_name', locality: 'long_name', administrative_area_level_1: 'short_name', country: 'long_name', postal_code: 'short_name' };

        if (place.address_components == undefined) return {}
        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
                userLocation[addressType] = place.address_components[i][componentForm[addressType]]
            }
        }
        userLocation.latitude = place.geometry.location.lat;
        userLocation.longitude = place.geometry.location.lng;
        userLocation.formatted_address = place.formatted_address

        return userLocation;
    }

    $rootScope._ = window._;
})
