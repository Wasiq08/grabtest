// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ngCordova', 'ionic-datepicker', 'ngGeolocation', 'ion-place-tools', 'ionic.ui.modalService', 'ionic-modal-select', 'LocalStorageModule', 'ionic.contrib.ui.hscrollcards', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'CoreApi'])

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

.run(function($rootScope, $state, localStorageService, User, Posts, $ionicSideMenuDelegate, $ionicLoading, $ionicActionSheet) {

    $rootScope.navigateState = function(state) {
        console.log("state is", state)
        $state.go(state)
    }

    $rootScope.defaultUser = 'img/user.png';

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

    $rootScope.logout = function() {
        $ionicLoading.show({
            template: 'Logging out!'
        })
        $rootScope.user = null;
        $ionicSideMenuDelegate.toggleLeft();
        User.logout().success(function(res) {
                localStorageService.set("auth_token", null);
                localStorageService.set("loggedInUser", null);

                $state.go('login')
                $ionicLoading.hide()
            })
            .error(function(err) {

            })

    }

    $rootScope.likeUnlikePost = function(likes, postid, data) {
        var uid = localStorageService.get('loggedInUser')._id;
        if (data.isLiked) {
            Posts.removeLike(postid)
                .success(function(res) {
                    data.isLiked = false;
                    for (var i = 0; i < likes.length; i++) {
                        if (likes[i].user == uid) {
                            likes.splice(i, 1)
                        }
                    }
                })
                .error(function(err) {

                })
        } else {
            Posts.addLike(postid)
                .success(function(res) {
                    data.isLiked = true;
                    likes.push({ user: uid })
                })
                .error(function(err) {

                })
        }
    }

    $rootScope.showActionSheet = function(uid, postid, i) {
        var _id = localStorageService.get('loggedInUser')._id;
        var buttons = []
        if (_id == uid) {
            buttons.push({ text: '<i class="icon ion-ios-trash"></i> Delete' })
        } else {
            buttons.push({ text: '<i class="icon ion-flag"></i> Report  ' })
        }

        var actionSheet = $ionicActionSheet.show({
            titleText: 'Actions',
            buttons: buttons,
            cancelText: '<i class="icon rd-txt lg-icon-cross-small"></i> <span class="rd-txt">Close</span>',
            cancel: function() {},
            buttonClicked: function(index) {
                if (index == 0) {

                    if (_id == uid) {
                        console.log("in if")
                        $ionicLoading.show({
                            template: 'Deleting Post'
                        })
                        Posts.deletePost(postid).success(function(res) {
                            $rootScope.$broadcast('POST_DELETED', { ind: i })
                            $ionicLoading.hide();
                        })
                    }
                }
                actionSheet();
            }

        })

    }


})
