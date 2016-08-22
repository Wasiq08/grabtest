angular.module('app.services', [])

.factory('BlankFactory', [function() {

}])

.service('BlankService', [function() {

}])

.service('ImageService', [function() {
    this.image = {}

    this.setImage = function(obj) {
        this.image = obj;
    }

    this.getImage = function() {
        return this.image;
    }
}])

.factory('Markers', [function() {
    var final_obj = {};
    final_obj.markers = [];

    final_obj.put = function(arr) {
        final_obj.markers = final_obj.markers.concat(arr)
    }

    final_obj.get = function() {
        return final_obj.markers;
    }

    return final_obj;

}])

.factory('HSSearch', [function() {

    var HSSearch = {
        lastParams: false,
        placeSearch: false,
        autocomplete: false,
        callback: false,

        componentForm: {
            street_number: 'short_name',
            route: 'long_name',
            locality: 'long_name',
            administrative_area_level_1: 'short_name',
            country: 'long_name',
            postal_code: 'short_name'
        },

        labelConversion: {
            "street_number": 'street_number',
            "route": 'route',
            "locality": 'city',
            "administrative_area_level_1": 'state',
            "country": 'country',
            "postal_code": 'zip'
        },

        init: function() {
            this.placeInit();
            $(document).on("gotPosition", HSSearch.biasResults);
        },

        biasResults: function() {
            var geolocation = new google.maps.LatLng(
                window.userPosition.coords.latitude, window.userPosition.coords.longitude);
            HSSearch.autocomplete.setBounds(new google.maps.LatLngBounds(geolocation,
                geolocation));
        },

        placeInit: function() {
            // Create the autocomplete object, restricting the search
            // to geographical location types.
            console.log("in place init service")
            HSSearch.autocomplete = new google.maps.places.Autocomplete(
                /** @type {HTMLInputElement} */
                (document.getElementById('searchInput')), { types: ['geocode'] });
            // When the user selects an address from the dropdown,
            // do search
            google.maps.event.addListener(HSSearch.autocomplete, 'place_changed', function() {
                HSSearch.fillInAddress();
            });
        },

        fillInAddress: function() {
            // Get the place details from the autocomplete object.
            var place = HSSearch.autocomplete.getPlace();

            // Get place lat/lon
            var params = {};
            params["lat"] = place.geometry.location.d;
            params["lon"] = place.geometry.location.e;
            params["full"] = $("#stormSearchInput").val();
            console.log(place)

            // Get each component of the address from the place details
            for (var i = 0; i < place.address_components.length; i++) {
                var addressType = place.address_components[i].types[0];
                if (HSSearch.labelConversion[addressType]) {
                    var lbl = HSSearch.labelConversion[addressType];
                    params[lbl] = place.address_components[i][HSSearch.componentForm[addressType]];
                }
            }

            console.log(params);
        }
    };

    return HSSearch;
}])

.service('CurrentLatLngService', [function() {
    this._latLang = {};
    this.save = function(latLang) {
        this._latLang = latLang;
    }
    this.get = function() {
        return this._latLang;
    }
}])

.service('CurrentLocationService', function($cordovaGeolocation, $q, Posts, CurrentLatLngService, localStorageService) {
    this.get = function() {
        var defered = $q.defer();
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
                localStorageService.set('currentLatLng', latlng);
                CurrentLatLngService.save(latlng);
                geocoder.geocode({ 'latLng': latlng }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            //$scope.final_obj.location = results[1];
                            console.log("result is ", results); // details address
                            var loc = {};
                            loc.location_name = results[0].formatted_address;
                            var lat = results[1].geometry.location.lat();
                            var lng = results[1].geometry.location.lng()
                            var arr = [];
                            arr[0] = lat;
                            arr[1] = lng;
                            loc.location = arr;
                            console.log(loc)
                            Posts.insertCurrentLocation(loc, { loc: 'current_location' }).success(function(res) {
                                    console.log(res)
                                    defered.resolve(true)
                                })
                                .error(function(err) {
                                    console.log(err)
                                    defered.reject("Error in inserting location");
                                })
                                //$scope.data.address = results[1].formatted_address;

                            //$scope.locationChanged(results[1].formatted_address)
                        } else {
                            console.log('Location not found');
                            defer.reject("Location not found");
                        }
                    } else {
                        console.log('Geocoder failed due to: ' + status);
                        defered.reject('Geocoder failed due to: ' + status);
                    }
                }, function(err) {
                    console.log("in error", err)
                    defered.reject("in error", err);
                });
            }, function(err) {
                // error
                defered.reject("in error", err);
            });

        return defered.promise;
    }
})


/* UploadSingleImage */
.service('ImageUploadService', function($cordovaCamera, httpService, $cordovaFileTransfer, $q, $rootScope) {
    //http://162.243.119.60:3000/upload/image?imageof=post
    $rootScope.loadedValue = 0.0;
    this.UploadNow = function(type, isCamera, isEditable) {
        var deferred = $q.defer();
        select(isCamera, isEditable).then(function(res) {
            //$rootScope.showLoading("Uploading", 100000)
            console.log('selected');
            upload(res, type).then(function(res) {
                console.log('uploaded');
                //$rootScope.hideLoading()
                deferred.resolve(res);
            }, function(err) {
                deferred.reject(err)
            })
        }, function(err) {
            deferred.reject(err)
        })
        return deferred.promise;
    }

    function select(isCamera, isEditable) {
        var options = {
            quality: 80,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: (isCamera == true) ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: isEditable || false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        var deferred = $q.defer();
        $cordovaCamera.getPicture(options).then(function(imageData) {
            console.log("image url", imageData);
            deferred.resolve(imageData)
        }, function(err) {
            deferred.reject(err)
        });
        return deferred.promise;
    }

    function upload(imageUri, type) {
        var route = httpService.Utils.buildUrl(new Array('upload', 'image'), { imageof: type }),
            filePath = imageUri;
        var options = {
            fileKey: "uploadfile",
            fileName: imageUri.substr(imageUri.lastIndexOf('/') + 1),
            chunkedMode: false,
            mimeType: "image/jpg",
            headers: httpService.Utils.getHeader().headers
        };

        var deferred = $q.defer();
        console.log('uploading');
        $cordovaFileTransfer.upload(route, filePath, options).then(function(result) {
            var res = JSON.parse(result.response)
            deferred.resolve(res);
        }, function(err) {
            deferred.reject(err)
        }, function(progress) {
            $rootScope.loadedValue = ((progress.loaded / progress.total) * 100).toString().split(".")[0];
            console.log($rootScope.loadedValue);
        });
        return deferred.promise;
    }
})
