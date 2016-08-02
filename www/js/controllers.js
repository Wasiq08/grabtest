angular.module('app.controllers', [])

.controller('loginCtrl', function($scope, User, $state, localStorageService) {
    $scope.users = {};
    $scope.users.user_email = 'ameerhamza810@gmail.com';
    $scope.users.password = 'autotek'
    $scope.login = function() {
        localStorageService.set("auth_token", null);
        localStorageService.set("loggedInUser", null);
        console.log("in login")
        var params = {
            email: $scope.users.user_email,
            password: $scope.users.password
        };
        User.login(params).success(function(res) {
                console.log(res)
                if (res.meta.status == 200) {
                    localStorageService.set("auth_token", res.data.auth.token);
                    localStorageService.set("loggedInUser", res.data.auth.user);
                    $state.go('welcome')
                }

            })
            .error(function(err) {
                console.log(err)
            })
    }

})

.controller('signUpCtrl', function($scope) {

})

.controller('welcomeCtrl', function($scope) {

})

.controller('processCtrl', function($scope) {

})

.controller('process1Ctrl', function($scope) {

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

.controller('dashboardCtrl', function($rootScope, $scope, Posts, $cordovaCamera, $state) {
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

    Posts.getAllFeeds().success(function(res) {
            console.log(res);
            $scope.feeds = res.data;
        })
        .error(function(err) {

        })

    $scope.getpicture = function() {
        var options = {
            quality: 80,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation: true,
            allowEdit: true,
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            console.log(imageData)
            $rootScope.imageData = "data:image/jpeg;base64," + imageData;
            $state.go('sidemenu.imagefilter');

            //var image = document.getElementById('myImage');
            //image.src = "data:image/jpeg;base64," + imageData;
        }, function(err) {
            // error
        });
    }

})

.controller('CreatePostCtrl', function($scope, appModalService, Posts, $rootScope, ImageService, $cordovaGeolocation) {
    $scope.imgobj = ImageService.getImage();
    $scope.final_obj = {};
    $scope.final_obj.location = {};
    $scope.final_obj.location.formatted_address = "Add Location";


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
    $scope.final_obj.remark = "Awsome food at ghazi salahudding road";





    $scope.getCurrentPostion = function() {
        console.log("hello")


    }

    $scope.selectCategory = function() {
        appModalService.show('templates/add-interest.html', 'CategoriesModalCtrl as vm', {}).then(function(res) {
            console.log(res)
        })
    }

    $scope.selectLocation = function() {
        console.log("hello")
            // appModalService.show('templates/location.html', 'LocationModalCtrl as vm', {}).then(function(res) {
            //     console.log("location ", res);
            //     $scope.final_obj.location = res.location;
            //     // if (res != null) {
            //     //     $scope.insertLocation = 1;
            //     //     $scope.goal.location = res.location;
            //     //     $scope.location = res.location.formatted_address;
            //     // }
            // })
        var posOptions = { timeout: 10000, enableHighAccuracy: false };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function(position) {
                var lat = 24.8752064
                var long = 67.08795439999994
                console.log(lat);
                console.log(long);

                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(lat, long);

                geocoder.geocode({ 'latLng': latlng }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            $scope.final_obj.location = results[1];
                            console.log(results[1]); // details address
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

    $scope.creatPost = function() {
        console.log($scope.final_obj)
        $scope.final_obj.category = $scope.selectCategory._id;
        Posts.create($scope.final_obj).success(function(result) {
                console.log(result);
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
