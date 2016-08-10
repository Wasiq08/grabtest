angular.module('app.controllers', [])

.controller('loginCtrl', function($scope, User, $ionicPopup, $ionicLoading, $state, localStorageService, $rootScope) {
    $scope.users = {};
    // $scope.users.user_email = 'ameerhamza810@gmail.com';
    // $scope.users.password = '123'

    $scope.show = function() {
        $ionicLoading.show({
            template: 'Loading...'
        })
    };
    $scope.hide = function() {
        $ionicLoading.hide()
    };

    $scope.login = function() {
        var errors = [];
        localStorageService.set("auth_token", null);
        localStorageService.set("loggedInUser", null);
        console.log("in login")
        var params = {
            email: $scope.users.user_email,
            password: $scope.users.password
        };
        $scope.show();
        User.login(params).success(function(res) {
                console.log(res)
                if (res.meta.status == 200) {
                    localStorageService.set("auth_token", res.data.auth.token);
                    localStorageService.set("loggedInUser", res.data.auth.user);
                    $rootScope.user = localStorageService.get("loggedInUser");
                    //$rootScope.$broadcast('User_changed', {user: localStorageService.get("loggedInUser")})
                    if (res.data.auth.user.on_boarding == 0) {
                        $scope.hide();
                        $state.go('welcome')
                    } else {
                        $scope.hide();
                        $state.go('sidemenu.dashboard')
                    }

                }

            })
            .error(function(err) {
                errors.push('Invalid Username/Password! ')
                $scope.showAlert(errors);
                $scope.hide();
            })
    }


    $scope.showAlert = function(err) {
        $scope.errors = err;
        var alertPopup = $ionicPopup.alert({
            title: 'Error!',
            template: '<div ng-repeat="err in errors">{{err}}</div>',
            scope: $scope
        });
        alertPopup.then(function(res) {
            console.log('Thank you for not eating my delicious ice cream cone');
        });
    };

})

.controller('SideMenuCtrl', function($scope, $rootScope, localStorageService) {
    $rootScope.user = localStorageService.get("loggedInUser");
    $rootScope.$on('User_changed', function(event, args) {
        $rootScope.user = args.user;
    })

})

.controller('signUpCtrl', function($scope, ionicDatePicker, $ionicLoading, localStorageService, $state, User, $ionicPopup, $rootScope) {
    $scope.user = {};
    $scope.user.date_of_birth = "Enter here!"
    var ipObj1 = {
        callback: function(val) { //Mandatory
            console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            var d = new Date(val);
            $scope.user.date_of_birth = d.toDateString();
            console.log($scope.user.date_of_birth)
        },
        disabledDates: [ //Optional
            new Date(2016, 2, 16),
            new Date(2015, 3, 16),
            new Date(2015, 4, 16),
            new Date(2015, 5, 16),
            new Date('Wednesday, August 12, 2015'),
            new Date("08-16-2016"),
            new Date(1439676000000)
        ],
        from: new Date(1951, 1, 1), //Optional
        to: new Date(2016, 10, 30), //Optional
        inputDate: new Date(), //Optional
        mondayFirst: true, //Optional
        disableWeekdays: [0], //Optional
        closeOnSelect: false, //Optional
        templateType: 'popup' //Optional
    };

    $scope.openDatePicker = function() {
        ionicDatePicker.openDatePicker(ipObj1);


    };

    $scope.submit = function() {
        var errors = [];

        if ($rootScope._.isEmpty($scope.user.name)) {
            errors.push('Name can not be null/empty.')
        } else if ($rootScope._.isEmpty($scope.user.email)) {
            errors.push('Email can not be null/empty.')
        } else if ($rootScope._.isEmpty($scope.user.password)) {
            errors.push('Please Enter Password')
        } else if ($rootScope._.isEmpty($scope.user.date_of_birth)) {
            errors.push('Please Enter D.O.B')
        }

        if (errors.length != 0) {
            $scope.showAlert(errors);
        } else {
            $scope.show();
            User.register($scope.user).success(function(result) {
                    var params = {
                        email: $scope.user.email,
                        password: $scope.user.password
                    };
                    User.login(params).success(function(res) {
                            console.log(res)
                            if (res.meta.status == 200) {
                                localStorageService.set("auth_token", res.meta.data.auth.token);
                                localStorageService.set("loggedInUser", res.meta.data.auth.user);
                                $rootScope.user = localStorageService.get("loggedInUser")
                                    //$rootScope.$broadcast('User_changed', {user: localStorageService.get("loggedInUser") });
                                console.log($scope.user)
                                $state.go('uploadimage')
                                $scope.hide();
                            }

                        })
                        .error(function(err) {
                            console.log(err)
                        })
                })
                .error(function(err) {
                    errors.push('Email is already taken!')
                    $scope.showAlert(errors);
                    $scope.hide();
                })
        }

    }


    $scope.showAlert = function(err) {
        $scope.errors = err;
        var alertPopup = $ionicPopup.alert({
            title: 'Error!',
            template: '<div ng-repeat="err in errors">{{err}}</div>',
            scope: $scope
        });
        alertPopup.then(function(res) {
            console.log('Thank you for not eating my delicious ice cream cone');
        });
    };

    $scope.show = function() {
        $ionicLoading.show({
            template: 'Loading...'
        })
    };
    $scope.hide = function() {
        $ionicLoading.hide()
    };
})

.controller('welcomeCtrl', function($scope) {

})

.controller('UploadImageCtrl', function($scope, User, $ionicLoading, $state, httpService, $cordovaFileTransfer, localStorageService, $cordovaCamera, $ionicActionSheet, $rootScope) {
    $scope.image = {}
    $scope.image.src = "img/user.png";

    $scope.next = function() {
        $state.go('welcome');
    }


    $scope.show = function() {
        $ionicLoading.show({
            template: 'Loading...'
        })
    };
    $scope.hide = function() {
        $ionicLoading.hide()
    };

    $scope.isLoading = false;
    $scope.addImage = function() {
        var options = {
            maximumImagesCount: 25,
            width: 800,
            height: 800,
            quality: 80
        };
        var actionSheet = $ionicActionSheet.show({
            titleText: 'Actions',
            buttons: [{ text: '<i class="icon lg-icon-gallery"></i> Gallery' }],
            //destructiveText: 'Delete',
            cancelText: '<i class="icon rd-txt lg-icon-cross-small"></i> <span class="rd-txt">Close</span>',
            cancel: function() {},
            buttonClicked: function(index) {
                if (index == 0) {

                    var options = {
                        quality: 80,
                        destinationType: Camera.DestinationType.FILE_URI,
                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                        allowEdit: false,
                        encodingType: Camera.EncodingType.JPEG,
                        popoverOptions: CameraPopoverOptions,
                        saveToPhotoAlbum: false
                    };

                    $cordovaCamera.getPicture(options).then(function(imageData) {
                        console.log(imageData)
                        var options = {
                            fileKey: "uploadfile",
                            fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
                            chunkedMode: false,
                            mimeType: "image/jpg",
                            headers: {
                                'x-access-token': localStorageService.get("auth_token")
                            }
                        };
                        //$scope.show();
                        $scope.isLoading = true;
                        $cordovaFileTransfer.upload('http://162.243.119.60:3000/upload/image?imageof=profile', imageData, options)
                            .then(function(res) {
                                console.log(JSON.stringify(localStorageService.get("loggedInUser")))
                                console.log("success", JSON.parse(res.response))
                                $scope.finalImage = JSON.parse(res.response);
                                $scope.image.src = $scope.finalImage.data.file[0].medium;
                                var profile_id = localStorageService.get("loggedInUser")._id;
                                var user_params = {
                                    profile_image_id: $scope.finalImage.data.fileId
                                };

                                User.updateprofile(user_params, profile_id)
                                    .success(function(response) {
                                        console.log(response)
                                        localStorageService.set("loggedInUser", response.data)
                                        $rootScope.user = localStorageService.get("loggedInUser")
                                            //$rootScope.$broadcast('User_changed',{user: localStorageService.get("loggedInUser")})
                                        console.log($scope.user)
                                        $scope.isLoading = false;
                                        //$scope.hide();
                                    })
                                    .error(function(err) {
                                        //$scope.hide();
                                        $scope.isLoading = false;

                                    })


                                // Success!
                            }, function(err) {
                                console.log(err)
                                $scope.isLoading = false;
                                // Error
                            }, function(progress) {
                                console.log("progress", progress)
                                    // constant progress updates
                            });
                        //$rootScope.imageData = "data:image/jpeg;base64," + imageData;
                        //$state.go('sidemenu.imagefilter');

                        //var image = document.getElementById('myImage');

                    }, function(err) {
                        // error
                        $scope.isLoading = false;
                    });
                }
                if (index == 1) {
                    var options = {
                        quality: 80,
                        destinationType: Camera.DestinationType.FILE_URI,
                        sourceType: Camera.PictureSourceType.CAMERA,
                        allowEdit: false,
                        encodingType: Camera.EncodingType.JPEG,
                        popoverOptions: CameraPopoverOptions,
                        saveToPhotoAlbum: false
                    };

                    $cordovaCamera.getPicture(options).then(function(imageData) {
                        console.log(imageData)
                        var options = {
                            fileKey: "uploadfile",
                            fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
                            chunkedMode: false,
                            mimeType: "image/jpg",
                            headers: {
                                'x-access-token': localStorageService.get("auth_token")
                            }
                        };
                        $scope.show();
                        $cordovaFileTransfer.upload('http://162.243.119.60:3000/upload/image?imageof=profile', imageData, options)
                            .then(function(res) {
                                console.log(JSON.stringify(localStorageService.get("loggedInUser")))
                                console.log("success", JSON.parse(res.response))
                                $scope.finalImage = JSON.parse(res.response);
                                $scope.image.src = $scope.finalImage.data.file[0].medium;
                                var user_params = {
                                        profile_image_id: $scope.finalImage.data.fileId
                                    }
                                    //User.updateprofile(user_params)
                                $scope.hide();
                                // Success!
                            }, function(err) {
                                console.log(err)
                                    // Error
                            }, function(progress) {
                                // constant progress updates
                            });
                        //$rootScope.imageData = "data:image/jpeg;base64," + imageData;
                        //$state.go('sidemenu.imagefilter');
                        //$scope.image.src = "data:image/jpeg;base64," + imageData;
                        //var image = document.getElementById('myImage');
                        //image.src = "data:image/jpeg;base64," + imageData;
                    }, function(err) {
                        // error
                    });
                }
                actionSheet();
            }
        })
    }
})

.controller('processCtrl', function($scope, Posts) {
    $scope.categories = []
    Posts.getCategories().success(function(res) {
            //$scope.categories = res.data
            for (var i = 0; i < res.data.length; i++) {
                $scope.categories.push({ text: res.data[i].category_name, checked: false, value: res.data[i]._id })
            }

        })
        .error(function(err) {
            console.log(err)
        })
})

.controller('process1Ctrl', function($scope, $state, User) {
    $scope.final_obj = {};
    $scope.clientSideList = [
        { text: "How often do you step out to eat?", value: "How often do you step out to eat?" },
        { text: "Everyday of the Week!!", value: "Everyday of the Week!!" },
        { text: "Once or twice a week", value: "Once or twice a week" },
        { text: "Once or twice a month", value: "Once or twice a month" },
        { text: "Hardly ever", value: "Hardly ever" }
    ];

    $scope.data = {
        clientSide: 'How often do you step out to eat?'
    };

    $scope.clientSideList2 = [
        { text: "Daily", value: "Daily" },
        { text: "Only on the weekends", value: "Only on the weekends" },
        { text: "Once or twice a week", value: "Once or twice a week" },
        { text: "Once or twice a month", value: "Once or twice a month" },
        { text: "I don't do grocery", value: "I don't do grocery" }
    ];

    $scope.data2 = {
        clientSide: 'Daily'
    };

    $scope.clientSideList3 = [
        { text: "To the end of block", value: "To the end of block" },
        { text: "0.25 Miles", value: "0.25 Miles" },
        { text: "0.5 - 1 Miles", value: "0.5 - 1 Miles" },
        { text: "1 - 2.5 Miles", value: "1 - 2.5 Miles" },
        { text: "I don't do grocery", value: "2.5 - 5 Miles" }
    ];

    $scope.data3 = {
        clientSide: 'To the end of block'
    };

    $scope.submit = function() {
        console.log($scope.data.clientSide)
        $scope.final_obj.q_step_out = $scope.data.clientSide;
        $state.go('process2')
    }

    $scope.submit2 = function() {
        $scope.final_obj.q_grocery_shopping = $scope.data2.clientSide;
        $state.go('process3')
    }

    $scope.submit3 = function() {
        $scope.final_obj.q_radius = $scope.data3.clientSide;
        User.consumer_answers($scope.final_obj)
            .success(function(res) {
                $state.go('sidemenu.dashboard')
            })
            .error(function(err) {

            })

    }
})

.controller('process2Ctrl', function($scope) {

})

.controller('process3Ctrl', function($scope) {

})

.controller('ImageFilterCtrl', function($scope, $state, ImageService, $ionicLoading, $q, $rootScope) {
    $scope.imageurl = 'img/dessert.jpg'
    $scope.media = {
        src: $rootScope.imageData || $scope.imageurl,
        album: [{

            class: 'img-normal',
            desc: 'normal'
        }, {

            class: 'aden',
            desc: 'aden'
        }, {

            class: 'inkwell',
            desc: 'inkwell'

        }, {

            class: 'perpetua',
            desc: 'perpetua'
        }, {

            class: 'reyes',
            desc: 'reyes'
        }, {

            class: 'gingham',
            desc: 'gingham'
        }, {

            class: 'toaster',
            desc: 'toaster'
        }, {

            class: 'walden',
            desc: 'walden'
        }, {

            class: 'hudson',
            desc: 'hudson'
        }, {

            class: 'earlybird',
            desc: 'earlybird'

        }, {

            class: 'mayfair',
            desc: 'mayfair'
        }, {

            class: 'lofi',
            desc: 'lofi'
        }, {

            class: '_1977',
            desc: '_1977'
        }, {

            class: 'brooklyn',
            desc: 'brooklyn'
        }, {

            class: 'xpro2',
            desc: 'xpro2'
        }, {

            class: 'nashville',
            desc: 'nashville'
        }, {

            class: 'lark',
            desc: 'lark'
        }, {

            class: 'moon',
            desc: 'moon'
        }, {

            class: 'clarendon',
            desc: 'clarendon'
        }, {

            class: 'rise',
            desc: 'rise'
        }, {

            class: 'slumber',
            desc: 'slumber'
        }]
    }

    $scope.class = 'img-normal';
    $scope.changeClass = function(i) {
        $scope.class = $scope.media.album[i].class

    }

    $scope.next = function() {
        ImageService.setImage({
            image: $scope.media.src,
            class: $scope.class
        })
        $state.go('sidemenu.createpost')
    }
})

.controller('dashboardCtrl', function($rootScope, $ionicPopup, $ionicHistory, $ionicPopover, ImageService, $ionicLoading, localStorageService, $scope, Posts, $cordovaFileTransfer, $cordovaCamera, $state, $ionicModal, $cordovaGeolocation) {
    console.log("in dashboard ctrl");
    if (localStorageService.get('loggedInUser')) {

    } else {
        $state.go('login')
    }

    // $scope.feeds = [{
    //     user: {
    //         src: 'img/waffle.jpg',
    //         name: 'Awsome Waffle! The hot Chocolate Like Dream!',
    //         price: '$ 11.24',
    //         media: [{
    //             small: 'img/John_Doe.jpg'
    //         }],
    //         user_src: 'img/John_Doe.jpg',
    //         name: 'John Doe'
    //     },
    //     feed: {
    //         location: {
    //             formatted_address: "Bar b q tonight, Karachi Pakistan"
    //         },
    //         price: 20,
    //         media: [{
    //             medium: 'img/waffle.jpg'
    //         }]
    //     }
    // }, {
    //     user: {
    //         src: 'img/hotchocolate.jpg',
    //         name: 'The hot Chocolate Like Dream! The hot Chocolate Like Dream! ',
    //         price: '$ 32.86',
    //         media: [{
    //             small: 'img/maria.jpg'
    //         }],
    //         user_src: 'img/maria.jpg',
    //         name: 'Ana Maria'
    //     },
    //     feed: {
    //         location: {
    //             formatted_address: "KababJees, Karachi Pakistan"
    //         },
    //         price: 20,
    //         media: [{
    //             medium: 'img/hotchocolate.jpg'
    //         }]
    //     }

    // }, {
    //     user: {
    //         src: 'img/dessert.jpg',
    //         name: 'Awsome Dessert!',
    //         price: '$ 20.00',
    //         media: [{
    //             small: 'img/evans.jpeg'
    //         }],
    //         user_src: 'img/evans.jpeg',
    //         name: 'Michael Evans'
    //     },
    //     feed: {
    //         location: {
    //             formatted_address: "Burger Lab, Karachi Pakistan"
    //         },
    //         price: 20,
    //         media: [{
    //             medium: 'img/dessert.jpg'
    //         }]
    //     }

    // }]

    //$rootScope.imageData = "img/dessert.jpg";
    $ionicModal.fromTemplateUrl('templates/search-filters.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();

    };

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.locationFilter = function() {
        cordova.plugins.diagnostic.requestLocationAuthorization(function(status) {
            switch (status) {
                case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                    console.log("Permission not requested");
                    break;
                case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                    cordova.plugins.diagnostic.isLocationEnabled(function(enabled) {
                        console.log("Location setting is " + (enabled ? "enabled" : "disabled"));
                        if (!enabled) {
                            var confirmPopup = $ionicPopup.confirm({
                                title: 'Your device GPS is off. Do you want turn on your GPS settings?'
                            });

                            confirmPopup.then(function(res) {
                                if (res) {

                                    cordova.plugins.diagnostic.switchToLocationSettings();
                                } else {
                                    console.log('You are not sure');
                                }
                            });
                        } else {
                            $ionicLoading.show({
                                template: 'Please wait!',
                                duration: 10000
                            })
                            var posOptions = { timeout: 10000, enableHighAccuracy: false };
                            $cordovaGeolocation
                                .getCurrentPosition(posOptions)
                                .then(function(position) {

                                    console.log("position is", position);
                                    //24.876852, 67.062625
                                    var lat = position.coords.latitude;
                                    var long = position.coords.longitude;
                                    console.log(lat);
                                    console.log(long);

                                    var geocoder = new google.maps.Geocoder();
                                    var latlng = new google.maps.LatLng(lat, long);

                                    geocoder.geocode({ 'latLng': latlng }, function(results, status) {
                                        if (status == google.maps.GeocoderStatus.OK) {
                                            if (results[0]) {
                                                //$scope.final_obj.location = results[1];
                                                console.log("result is ", results); // details address
                                                $scope.loc = {};
                                                $scope.loc.location_name = results[0].formatted_address;
                                                var lat = results[1].geometry.location.lat();
                                                var lng = results[1].geometry.location.lng()
                                                var arr = [];
                                                arr[0] = lat;
                                                arr[1] = lng;
                                                $scope.loc.location = arr;
                                                console.log($scope.loc)
                                                Posts.insertLocation($scope.loc).success(function(res) {
                                                        console.log(res)
                                                        $ionicLoading.hide();
                                                        $scope.modal.hide();
                                                        $scope.doRefresh();
                                                    })
                                                    .error(function(err) {
                                                        console.log(err)
                                                    })
                                                    //$scope.data.address = results[1].formatted_address;

                                                //$scope.locationChanged(results[1].formatted_address)
                                            } else {
                                                console.log('Location not found');
                                            }
                                        } else {
                                            console.log('Geocoder failed due to: ' + status);
                                        }
                                    }, function(err) {
                                        console.log("in error", err)
                                    });
                                }, function(err) {
                                    // error
                                });
                        }
                    }, function(error) {
                        console.error("The following error occurred: " + error);

                    });
                    break;
                case cordova.plugins.diagnostic.permissionStatus.DENIED:
                    console.log("Permission denied");
                    break;
                case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                    console.log("Permission permanently denied");
                    break;
            }
        }, function(error) {
            console.error(error);
        });
    }

    $scope.feeds = []
    var page = offset = 0;
    var limit = 5;
    var uid = localStorageService.get('loggedInUser')._id;

    $scope.noMoreFeedContent = false;
    $scope.getDashboardFeed = function(start) {

        var _start = start || false;
        console.log("start ", _start)
        Posts.getAllFeeds({ offset: offset, limit: limit, loc: location }).success(function(res) {
                if (_start) {
                    $scope.feeds = [];
                }
                if (res.data.length < limit) {
                    $scope.noMoreFeedContent = true;
                } else {
                    $scope.noMoreFeedContent = false;
                }
                console.log(res.data.length)

                for (var i = 0; i < res.data.length; i++) {
                    $scope.feeds.push(res.data[i]);
                    for (var j = 0; j < res.data[i].feed.likes.length; j++) {
                        if (uid == res.data[i].feed.likes[j].user) {
                            $scope.feeds[i].isLiked = true;
                        } else {
                            $scope.feeds[i].isLiked = false;
                        }
                    }
                }

                console.log($scope.feeds)


                offset = offset + limit;
                if (_start) {
                    $scope.$broadcast('scroll.refreshComplete');
                    //$scope.$apply()
                } else {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                //$scope.feeds = res.data;
            })
            .error(function(err) {

            })
    };

    $scope.doRefresh = function() {
        console.log("in do refresh")
        offset = 0;
        $scope.getDashboardFeed(true);
        $scope.noMoreFeedContent = true

    }

    $rootScope.$on('POST_CREATED', function(event, args) {
        $scope.feeds.unshift(args.post)
    })

    $scope.getpicture = function() {
        var options = {
            quality: 80,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            console.log(imageData)
            $state.go('sidemenu.createpost');

            $rootScope.postimagedata = imageData;
            //= "data:image/jpeg;base64," + imageData;


            //var image = document.getElementById('myImage');
            //image.src = "data:image/jpeg;base64," + imageData;
        }, function(err) {
            // error
        });
    }

    $scope.navigateToFoodPost = function(postid) {
        $state.go('sidemenu.foodprofile', { id: postid })
    }

    $scope.navigateToUser = function(uid) {
        $state.go('sidemenu.profile', { id: uid })
    }

    // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('templates/partials/popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });


    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
        // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
        // Execute action
    });

})

.controller('CreatePostCtrl', function($scope, $cordovaFileTransfer, localStorageService, appModalService, Posts, $rootScope, ImageService, $cordovaGeolocation, $ionicHistory, $state) {
    $scope.imgobj = ImageService.getImage();
    $scope.final_obj = {};
    $scope.isloading = true;
    $scope.loadedvalue = 0.0;
    var imageData = $rootScope.postimagedata;
    //$scope.final_obj.location = {"lon":51.12076493195686,"lat":-113.98040771484375};
    try {
        var options = {
            fileKey: "uploadfile",
            fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
            chunkedMode: false,
            mimeType: "image/jpg",
            headers: {
                'x-access-token': localStorageService.get("auth_token")
            }
        };
        //$scope.show();
        $cordovaFileTransfer.upload('http://162.243.119.60:3000/upload/image?imageof=post', imageData, options)
            .then(function(res) {
                $scope.finalImage = JSON.parse(res.response);
                $scope.imageData = $scope.finalImage.data.file[0].medium;
                $scope.isloading = false;
                $scope.final_obj.post_image_id = $scope.finalImage.data.fileId;
            }, function(err) {
                console.log(err)
                $scope.isloading = false;
                //$scope.hide();
                // Error
            }, function(progress) {

                var value = ((progress.loaded / progress.total) * 100).toString().split(".")[0];
                //var a = 12345.67;

                //alert(value.toString().split(".")[0]); ///before
                //alert(value.toString().split(".")[1]); ///after
                $scope.loadedvalue = value;
                //console.log(value)
                // constant progress updates
            });
    } catch (err) {

    }

    $scope.final_obj.loc_name = "Add Location";


    Posts.getCategories().success(function(res) {
            console.log(res);
            $scope.selectables = res.data
        })
        .error(function(err) {
            console.log(err)
        })

    $scope.selectCategory = {}
    $scope.selectCategory.category_name = "Select Category";

    $scope.final_obj.category = "Select Category";
    $scope.final_obj.price = 30;
    $scope.final_obj.remark = "";

    $scope.getCurrentPostion = function() {
        console.log("hello")


    }


    $scope.selectCategory = function() {
        appModalService.show('templates/partials/category.html', 'SelectCategoryCtrl as vm', {}).then(function(res) {
            console.log(res)
            if (res != null) {
                $scope.selectedCategory = res
                $scope.final_obj.category = res.category_name;
                $scope.selectCategory.category_name = res.category_name;
            }
        })
    }

    $scope.selectCategoryOption = function() {
        console.log("hello")
        appModalService.show('templates/add-interest.html', 'CategoriesModalCtrl as vm', {}).then(function(res) {
            console.log(res)
            if (res != null) {
                $scope.insertTags = 1;
                $scope.final_obj.tag = res.hashtags;
                $scope.hashtags = res.hashtags;
                //CreateGoalDataService.setTags(res.hashtags);
            }
        })
    }

    $scope.selectLocation = function() {
        console.log("hello")
        $state.go('sidemenu.map');

        // appModalService.show('templates/location.html', 'LocationModalCtrl as vm', {}).then(function(res) {
        //     console.log("location ", res.location);
        //     if (res != null) {
        //         var lat = res.location.geometry.location.lat();
        //         var lng = res.location.geometry.location.lng()
        //         var arr = [];
        //         arr[0] = lat;
        //         arr[1] = lng;
        //         $scope.final_obj.location = arr;
        //         $scope.final_obj.loc_name = res.location.formatted_address;
        //     }
        //     // if (res != null) {
        //     //     $scope.insertLocation = 1;
        //     //     $scope.goal.location = res.location;
        //     //     $scope.location = res.location.formatted_address;
        //     // }
        // })
    }

    $scope.creatPost = function() {
        console.log($scope.final_obj)
        console.log($scope.selectCategory)
        $scope.final_obj.category = $scope.selectCategory.category_name;
        Posts.create($scope.final_obj).success(function(result) {
                console.log(result);
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                //$rootScope.$broadcast('POST_CREATED', {post: result.data});
                $state.go('sidemenu.dashboard');
            })
            .error(function(err) {
                console.log(err);
            })
    }


})

.controller('SelectCategoryCtrl', function($scope, Posts) {
    var vm = this;

    $scope.isLoading = true;
    // CategoriesServices.getAll().success(function(res) {
    //     $scope.categories = res.data;
    //     $scope.isLoading = false;

    // })

    Posts.getCategories().success(function(res) {
            console.log(res);
            $scope.categories = res.data
            $scope.isLoading = false;
        })
        .error(function(err) {
            console.log(err)
        })

    vm.confirm = function(category) {
        $scope.closeModal(category);
    };

    vm.selectedItem = function(category) {
        vm.category = category
    };

    vm.cancel = function() {
        $scope.closeModal(null);
    };
})

.controller('LocationModalCtrl', ['$scope', '$q', '$cordovaGeolocation', function($scope, $q, $cordovaGeolocation) {
    var vm = this;
    $scope.gPlace;
    $scope.data = {};

    $scope.locationChanged = function(location) {
        console.log("in location changed", location)
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            address: location
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                console.log("status", results[0].geometry.location.lat())
                vm.location = results[0];
                $q.resolve(results);
            } else {
                $q.reject();
            }
        });
    }

    vm.confirm = function(category) {
        $scope.closeModal(category);
    };

    vm.cancel = function() {
        $scope.closeModal(null);
    };

    $scope.selectLocation = function() {
        console.log("hello")
            //$scope.final_obj.location = [24.883040, 67.066413];
        var posOptions = { timeout: 10000, enableHighAccuracy: false };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function(position) {

                console.log("position is", position);
                //24.876852, 67.062625
                var lat = position.coords.latitude;
                var long = position.coords.longitude;
                console.log(lat);
                console.log(long);

                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(lat, long);

                geocoder.geocode({ 'latLng': latlng }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            //$scope.final_obj.location = results[1];
                            console.log(results[1]); // details address
                            $scope.data.address = results[1].formatted_address;
                            $scope.locationChanged(results[1].formatted_address)
                        } else {
                            console.log('Location not found');
                        }
                    } else {
                        console.log('Geocoder failed due to: ' + status);
                    }
                });
            }, function(err) {
                // error
            });

    }


}])

.controller('CategoriesModalCtrl', ['$scope', function($scope) {
    var vm = this;
    vm.hashtags = []
    vm.featuredTags = []
    $scope.featTags = []
    $scope.featTagsClass = [];

    $scope.hashtags = []

    $scope.isLoading = true;

    var addHashTag = function(currentVal) {
        currentVal = currentVal.replace(/(\s+)/ig, ' ');
        currentVal = currentVal.replace(/(\s)/ig, '-');
        currentVal = currentVal.replace('#', '');
        if ($scope.hashtags.indexOf("#" + currentVal) == -1) {
            $scope.hashtags.push("#" + currentVal);
            vm.hashtags.push("#" + currentVal);
        }

    }

    $scope.selectFeatureTag = function(index, tag) {
        if ($scope.featTagsClass[index] == '') {
            $scope.featTagsClass[index] = 'active';
            vm.hashtags.push("#" + tag);
            $scope.hashtags.push("#" + tag);
        } else {
            $scope.featTagsClass[index] = '';

            var tagname = "#" + tag;
            for (var i = 0; i < $scope.hashtags.length; i++) {
                if ($scope.hashtags[i] == tagname) {
                    $scope.hashtags.splice(i, 1);
                    vm.hashtags.splice(i, 1);
                }
            }

        }

    }


    $scope.removeHashTags = function(event) {
        $scope.hashtags.splice(event.target.dataset.index, 1);
    }

    $scope.keypress = function(event) {
        var hashtag = event.target.innerText;

        if (event.keyCode == 32 || event.keyCode == 188 || event.keyCode == 13 || event.keyCode == 190 || event.keyCode == 44) {
            event.preventDefault();

            if (!!event.target.innerHTML === true) {

                addHashTag(event.target.innerHTML);
                event.target.innerHTML = "";
            }
        }
    }

    $scope.focus = function(event) {
        event.target.innerHTML = "";
    }

    $scope.blur = function(event) {
        if (event.target.innerHTML == "") {
            event.target.innerHTML = "Add Hashtag";
        }
    }

    $scope.keydown = function(event) {
        if (event.keyCode == 8) {
            $scope.hashtags.pop();
        }
    }

    vm.confirm = function(category) {
        vm.hashtags = $scope.hashtags;
        $scope.closeModal(category);
    };

    vm.cancel = function() {
        $scope.closeModal(null);
    };
}])

.controller('ProfileCtrl', function($scope, User, $stateParams) {
    $scope.feeds = [{
        src: 'img/waffle.jpg',
        name: 'Awsome Waffle! The hot Chocolate Like Dream!',
        price: '$ 11.24',
        user_src: 'img/John_Doe.jpg',
        user_name: 'John Doe'
    }, {
        src: 'img/hotchocolate.jpg',
        name: 'The hot Chocolate Like Dream! The hot Chocolate Like Dream! ',
        price: '$ 32.86',
        user_src: 'img/maria.jpg',
        user_name: 'Ana Maria'
    }, {
        src: 'img/dessert.jpg',
        name: 'Awsome Dessert!',
        price: '$ 20.00',
        user_src: 'img/evans.jpeg',
        user_name: 'Michael Evans'
    }]

    User.getUser($stateParams.id).success(function(res) {
        console.log(res)
        $scope.user = res.data;
    })

    User.getUserPost($stateParams.id).success(function(res) {
            console.log(res)
            $scope.posts = res.data;
        })
        .error(function(err) {
            console.log(err)
        })
})

.controller('TurnLocationCtrl', ['$scope', function($scope) {

}])

.controller('FoodProfileCtrl', function($scope, localStorageService, Posts, $stateParams, $ionicPopup) {
    // $scope.x = {
    //     src: 'img/waffle.jpg',
    //     name: 'Awsome Waffle! The hot Chocolate Like Dream! Awsome Waffle! The hot Chocolate Like Dream!',
    //     price: '$ 11.24',
    //     user_src: 'img/John_Doe.jpg',
    //     user_name: 'John Doe'
    // }

    // $scope.comments = [{
    //     user_src: "img/John_Doe.jpg",
    //     user_name: "John Doe",
    //     comment: "Nice thats the way Mahi way!",
    //     created: "few secs ago!"
    // }, {
    //     user_src: "img/maria.jpg",
    //     user_name: "Ana Maria",
    //     comment: "You cant see meeeeeeeeeee!",
    //     created: "few secs ago!"
    // }, {
    //     user_src: "img/evans.jpeg",
    //     user_name: "Michael Evans",
    //     comment: "Dil Dil Pakistan Jaan Jaan Pakistan! Dil Dil Pakistan Jaan Jaan Pakistan!",
    //     created: "few secs ago!"
    // }, {
    //     user_src: "img/John_Doe.jpg",
    //     user_name: "John Doe",
    //     comment: "Nice thats the way Mahi way!",
    //     created: "few secs ago!"
    // }, {
    //     user_src: "img/maria.jpg",
    //     user_name: "Ana Maria",
    //     comment: "You cant see meeeeeeeeeee!",
    //     created: "few secs ago!"
    // }, {
    //     user_src: "img/evans.jpeg",
    //     user_name: "Michael Evans",
    //     comment: "Dil Dil Pakistan Jaan Jaan Pakistan! Dil Dil Pakistan Jaan Jaan Pakistan!",
    //     created: "few secs ago!"
    // }]
    $scope.uid = localStorageService.get('loggedInUser')._id;

    $scope.postid = $stateParams.id;
    Posts.get($stateParams.id).success(function(res) {
            console.log(res)
            $scope.post = res.data[0];
            for (var j = 0; j < res.data[0].likes.length; j++) {
                if ($scope.uid == res.data[0].likes[j].user) {
                    $scope.post.isLiked = true;
                } else {
                    $scope.post.isLiked = false;
                }
            }

        })
        .error(function(err) {

        })

    Posts.getAllComments($stateParams.id).success(function(res) {
            console.log(res)
            $scope.comments = res.data.comments;
        })
        .error(function(err) {
            console.log(err);

        })
    $scope.params = {};
    $scope.comment = function() {

        Posts.addComment($scope.params, $scope.postid).success(function(res) {
                console.log(res)
                $scope.comments.push(res.data.comments)
                $scope.params.text = "";
            })
            .error(function(err) {

            })
    }

    $scope.showConfirm = function(id) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Consume Ice Cream',
            template: 'Are you sure you want to eat this ice cream?'
        });
        confirmPopup.then(function(res) {
            if (res) {
                Posts.deleteComment($stateParams.id, id).success(function(res) {
                        console.log(res)
                        for (var i = 0; i < $scope.comments.length; i++) {
                            if (id == $scope.comments[i]._id) {
                                $scope.comments.splice(i, 1);
                            }
                        }
                    })
                    .error(function(err) {

                    })
            } else {

            }
        });
    };
})

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {
    console.log("in map ctrl")
    var options = { timeout: 10000, enableHighAccuracy: true };

    $scope.locationChanged = function(location) {
        console.log("in location changed", location)
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            address: location
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                console.log("status", results[0].geometry.location.lat(),  results[0].geometry.location.lng())


                var latLng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());

                var mapOptions = {
                    center: latLng,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
                //vm.location = results[0];
                //$q.resolve(results);
            } else {
                //$q.reject();
            }
        });
    }


    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    }, function(error) {
        console.log("Could not get location");
    });
})

// .controller('MapCtrl', function($scope, $ionicLoading) {
//     console.log("in map ctrl")
//     function initialize() {
//         var mapOptions = {
//             center: new google.maps.LatLng(43.07493, -89.381388),
//             zoom: 16,
//             mapTypeId: google.maps.MapTypeId.ROADMAP
//         };
//         var map = new google.maps.Map(document.getElementById("map"),
//             mapOptions);

//         // Stop the side bar from dragging when mousedown/tapdown on the map
//         google.maps.event.addDomListener(document.getElementById('map'), 'mousedown', function(e) {
//             e.preventDefault();
//             return false;
//         });

//         $scope.map = map;
//     }
//     google.maps.event.addDomListener(window, 'load', initialize);

//     $scope.centerOnMe = function() {
//         if (!$scope.map) {
//             return;
//         }

//         $scope.loading = $ionicLoading.show({
//             content: 'Getting current location...',
//             showBackdrop: false
//         });

//         navigator.geolocation.getCurrentPosition(function(pos) {
//             $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
//             $scope.loading.hide();
//         }, function(error) {
//             alert('Unable to get location: ' + error.message);
//         });
//     };
// });
