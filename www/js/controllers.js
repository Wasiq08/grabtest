angular.module('app.controllers', [])

.controller('loginCtrl', function($scope, User, $ionicPopup, $ionicLoading, $state, localStorageService) {
    $scope.users = {};
    $scope.users.user_email = 'ameerhamza810@gmail.com';
    $scope.users.password = '123'

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
                    $state.go('welcome')
                    $scope.hide();
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

.controller('SideMenuCtrl', function($scope, localStorageService) {
    $scope.user = localStorageService.get("loggedInUser")

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

.controller('UploadImageCtrl', function($scope, User, $ionicLoading, $state, httpService, $cordovaFileTransfer, localStorageService, $cordovaCamera, $ionicActionSheet) {
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
    $scope.addImage = function() {
        var options = {
            maximumImagesCount: 25,
            width: 800,
            height: 800,
            quality: 80
        };
        var actionSheet = $ionicActionSheet.show({
            titleText: 'Actions',
            buttons: [{ text: '<i class="icon lg-icon-gallery"></i> Gallery' }, { text: '<i class="icon lg-icon-camera"></i> Camera' }],
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
                        $scope.show();
                        $cordovaFileTransfer.upload('http://162.243.119.60:3000/upload/image?imageof=profile', imageData, options)
                            .then(function(res) {
                                console.log(JSON.stringify(localStorageService.get("loggedInUser")))
                                console.log("success", JSON.parse(res.response))
                                $scope.finalImage = JSON.parse(res.response);
                                $scope.image.src = $scope.finalImage.data.file[0].medium;
                                var profile_id = localStorageService.get("loggedInUser")[0]._id;
                                var user_params = {
                                    profile_image_id: $scope.finalImage.data.fileId
                                };

                                User.updateprofile(user_params, profile_id)
                                    .success(function(response) {
                                        console.log(response)
                                        $scope.hide();
                                        User.getUser(profile_id)
                                            .success(function(res) {
                                                console.log(res)
                                                    //localStorageService.get("loggedInUser") = []
                                            })
                                            .error(function(err) {

                                            })
                                    })
                                    .error(function(err) {
                                        $scope.hide();

                                    })


                                // Success!
                            }, function(err) {
                                console.log(err)
                                    // Error
                            }, function(progress) {
                                // constant progress updates
                            });
                        //$rootScope.imageData = "data:image/jpeg;base64," + imageData;
                        //$state.go('sidemenu.imagefilter');

                        //var image = document.getElementById('myImage');

                    }, function(err) {
                        // error
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

.controller('dashboardCtrl', function($rootScope, $ionicLoading, localStorageService, $scope, Posts, $cordovaFileTransfer, $cordovaCamera, $state) {
    console.log("in dashboard ctrl");
    
    $scope.feeds = [{
        user: {
            src: 'img/waffle.jpg',
            name: 'Awsome Waffle! The hot Chocolate Like Dream!',
            price: '$ 11.24',
            media: [{
                small: 'img/John_Doe.jpg'
            }],
            user_src: 'img/John_Doe.jpg',
            name: 'John Doe'
        },
        feed: {
            location: {
                formatted_address: "Bar b q tonight, Karachi Pakistan"
            },
            price : 20
        }
    }, {
        user: {
            src: 'img/hotchocolate.jpg',
            name: 'The hot Chocolate Like Dream! The hot Chocolate Like Dream! ',
            price: '$ 32.86',
            media: [{
                small: 'img/maria.jpg'
            }],
            user_src: 'img/maria.jpg',
            name: 'Ana Maria'
        },
        feed: {
            location: {
                formatted_address: "KababJees, Karachi Pakistan"
            },
            price : 20
        }

    }, {
        user: {
            src: 'img/dessert.jpg',
            name: 'Awsome Dessert!',
            price: '$ 20.00',
            media: [{
                small: 'img/evans.jpeg'
            }],
            user_src: 'img/evans.jpeg',
            name: 'Michael Evans'
        },
        feed: {
            location: {
                formatted_address: "Burger Lab, Karachi Pakistan"
            },
            price : 20
        }

    }]

    $rootScope.imageData = "img/dessert.jpg";

    //$scope.feeds = []

    Posts.getAllFeeds().success(function(res) {
            console.log(res);
            for (var i = 0; i < res.data.length; i++) {
                $scope.feeds.push(res.data[i]);
            }
            //$scope.feeds = res.data;
        })
        .error(function(err) {

        })

    $scope.show = function() {
        $ionicLoading.show({
            template: 'Loading...'
        })
    };
    $scope.hide = function() {
        $ionicLoading.hide()
    };

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
            $cordovaFileTransfer.upload('http://162.243.119.60:3000/upload/image?imageof=post', imageData, options)
                .then(function(res) {
                    console.log(JSON.stringify(localStorageService.get("auth_token")))
                    console.log("success", JSON.parse(res.response))
                    $scope.finalImage = JSON.parse(res.response);
                    $rootScope.imageData = $scope.finalImage.data.file[0].medium;
                    localStorageService.set("file_id", $scope.finalImage.data.fileId)
                    $state.go('sidemenu.imagefilter');
                    $scope.hide();
                    // Success!
                }, function(err) {
                    console.log(err)
                        // Error
                }, function(progress) {
                    // constant progress updates
                });
            //= "data:image/jpeg;base64," + imageData;


            //var image = document.getElementById('myImage');
            //image.src = "data:image/jpeg;base64," + imageData;
        }, function(err) {
            // error
        });
    }

})

.controller('CreatePostCtrl', function($scope, localStorageService, appModalService, Posts, $rootScope, ImageService, $cordovaGeolocation, $ionicHistory, $state) {
    $scope.imgobj = ImageService.getImage();
    $scope.final_obj = {};
    $scope.final_obj.location = {};
    $scope.final_obj.location.formatted_address = "Add Location";
    $scope.final_obj.post_image_id = localStorageService.get("file_id")

    Posts.getCategories().success(function(res) {
            console.log(res);
            $scope.selectables = res.data
        })
        .error(function(err) {
            console.log(err)
        })

    $scope.selectCategory = {}
    $scope.selectCategory.category_name = "Select Category";

    $scope.final_obj.category = "5799afbc88aed4ec19fdc652";
    $scope.final_obj.price = 30;
    $scope.final_obj.remark = "";





    $scope.getCurrentPostion = function() {
        console.log("hello")


    }

    $scope.selectCategoryOption = function() {
        appModalService.show('templates/add-interest.html', 'CategoriesModalCtrl as vm', {}).then(function(res) {
            console.log(res)
        })
    }

    $scope.selectLocation = function() {
        console.log("hello")

        // var posOptions = { timeout: 10000, enableHighAccuracy: false };
        // $cordovaGeolocation
        //     .getCurrentPosition(posOptions)
        //     .then(function(position) {
        //         var lat = 24.878511
        //         var long = 67.065936
        //         console.log(lat);
        //         console.log(long);

        //         var geocoder = new google.maps.Geocoder();
        //         var latlng = new google.maps.LatLng(lat, long);

        //         geocoder.geocode({ 'latLng': latlng }, function(results, status) {
        //             if (status == google.maps.GeocoderStatus.OK) {
        //                 if (results[1]) {
        //                     $scope.final_obj.location = results[1];
        //                     console.log(results[1]); // details address
        //                 } else {
        //                     console.log('Location not found');
        //                 }
        //             } else {
        //                 console.log('Geocoder failed due to: ' + status);
        //             }
        //         });
        //     }, function(err) {
        //         // error
        //     });

        appModalService.show('templates/location.html', 'LocationModalCtrl as vm', {}).then(function(res) {
            console.log("location ", res.location);
            $scope.final_obj.location = res.location;
            // if (res != null) {
            //     $scope.insertLocation = 1;
            //     $scope.goal.location = res.location;
            //     $scope.location = res.location.formatted_address;
            // }
        })
    }

    $scope.creatPost = function() {
        console.log($scope.final_obj)
        $scope.final_obj.category = $scope.selectCategory._id;
        Posts.create($scope.final_obj).success(function(result) {
                console.log(result);
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });

                $state.go('sidemenu.dashboard');
            })
            .error(function(err) {
                console.log(err);
            })
    }


})

.controller('LocationModalCtrl', ['$scope', '$q', function($scope, $q) {
    var vm = this;
    $scope.gPlace;

    $scope.locationChanged = function(location) {

        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            address: location
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                console.log("status", results)
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
}])

.controller('CategoriesModalCtrl', ['$scope', function($scope) {
    var vm = this;
    vm.hashtags = []
    vm.featuredTags = []
    $scope.featTags = []
    $scope.featTagsClass = [];

    $scope.hashtags = []
        //console.log(CreateGoalDataService.getTags())

    //$scope.hashtags = CreateGoalDataService.getTags();
    //vm.hashtags = CreateGoalDataService.getTags();

    $scope.isLoading = true;
    // ExploreServices.featuredTags().success(function(res) {
    //     $scope.featTags = res.data;
    //     $scope.isLoading = false;
    //     for (var i = 0; i < res.data.length; i++) {
    //         $scope.featTagsClass[i] = '';
    //     }
    // })

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
            vm.hashtags.push("#" + tag.tagname);
            $scope.hashtags.push("#" + tag.tagname);
        } else {
            $scope.featTagsClass[index] = '';

            var tagname = "#" + tag.tagname;
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

.controller('ProfileCtrl', function($scope) {
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
})

.controller('FoodProfileCtrl', function($scope) {
    $scope.x = {
        src: 'img/waffle.jpg',
        name: 'Awsome Waffle! The hot Chocolate Like Dream! Awsome Waffle! The hot Chocolate Like Dream!',
        price: '$ 11.24',
        user_src: 'img/John_Doe.jpg',
        user_name: 'John Doe'
    }

    $scope.comments = [{
        user_src: "img/John_Doe.jpg",
        user_name: "John Doe",
        comment: "Nice thats the way Mahi way!",
        created: "few secs ago!"
    }, {
        user_src: "img/maria.jpg",
        user_name: "Ana Maria",
        comment: "You cant see meeeeeeeeeee!",
        created: "few secs ago!"
    }, {
        user_src: "img/evans.jpeg",
        user_name: "Michael Evans",
        comment: "Dil Dil Pakistan Jaan Jaan Pakistan! Dil Dil Pakistan Jaan Jaan Pakistan!",
        created: "few secs ago!"
    }, {
        user_src: "img/John_Doe.jpg",
        user_name: "John Doe",
        comment: "Nice thats the way Mahi way!",
        created: "few secs ago!"
    }, {
        user_src: "img/maria.jpg",
        user_name: "Ana Maria",
        comment: "You cant see meeeeeeeeeee!",
        created: "few secs ago!"
    }, {
        user_src: "img/evans.jpeg",
        user_name: "Michael Evans",
        comment: "Dil Dil Pakistan Jaan Jaan Pakistan! Dil Dil Pakistan Jaan Jaan Pakistan!",
        created: "few secs ago!"
    }]
})
