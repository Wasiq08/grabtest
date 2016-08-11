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

.service('App', function($q, UserService, UserDataServices) {
    this.init = function() {
        var deferred = $q.defer();
        $timeout(function(){
        	if (localStorageService.get('loggedInUser')) {
        		deferred.resolve(true);
        	}
        	else {
        		deferred.reject()
        	}
        },1000)

        return deferred.promise;
    }
})

.service("UserService", function(localStorageService, $q, $location) {
    this.getLoggedInUser = function() {
        if (sessionUser = localStorageService.get('loggedInUser')) {
            return sessionUser.user
        } else {
            return {};
        }
    }

    this.isAuthenticated = function() {
        if (sessionUser = localStorageService.get('loggedInUser')) {
            return true;
        } else {
            return false;
        }
    }

    this.getLoggedInUserId = function() {
        if (sessionUser = localStorageService.get('loggedInUser')) {
            if ("user" in sessionUser) {
                return sessionUser.user.uid
            }
        }
        return 0;
    }

    this.getClientId = function() {
        if (sessionUser = localStorageService.get('loggedInUser')) {
            if ("credentials" in sessionUser) {
                return sessionUser.credentials.client_id
            } else {
                return null;
            }
        }
    }

    this.getCredentials = function() {
        if (sessionUser = localStorageService.get('loggedInUser')) {
            if ("credentials" in sessionUser) {
                return sessionUser.credentials
            } else {
                return null;
            }
        }
    }

    this.me = function() {
        if (sessionUser = localStorageService.get('loggedInUser')) {
            try {
                user = {
                    uid: sessionUser.user.uid,
                    name: sessionUser.user.name,
                    username: sessionUser.user.username,
                    bio: sessionUser.user.bio,
                    email: sessionUser.user.user_email,
                    image: sessionUser.user.profile.medium,
                    cover: sessionUser.user.cover.large,
                    location: sessionUser.user.location,
                    dob: sessionUser.user.dob,
                    dob_show: sessionUser.user.dob_show
                }
                return user;
            } catch (e) {
                localStorageService.remove('loggedInUser')
            }
        } else {
            return {}
        }
    }

    this.updateLS = function(params) {
        if (sessionUser = localStorageService.get('loggedInUser')) {
            if (params.hasOwnProperty("image")) {
                sessionUser.user.profile = params.image;
            }
            if (params.hasOwnProperty("cover")) {
                sessionUser.user.cover = params.cover;
            }
            if (params.hasOwnProperty("name")) {
                sessionUser.user.name = params.name;
            }
            if (params.hasOwnProperty("bio")) {
                sessionUser.user.bio = params.bio;
            }
            if (params.hasOwnProperty("location")) {
                sessionUser.user.location = params.location;
            }

            if (params.hasOwnProperty("verified")) {
                sessionUser.user.verified = params.verified;
            }

            localStorageService.set("loggedInUser", sessionUser);
            return true;
        } else {
            return false;
        }
    }

    this.skipIfLoggedIn = function() {
        localStorageService.set("userLoginEnter", 1);
        var deferred = $q.defer();
        if (this.isAuthenticated()) {
            $location.path('/dashboard');
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }

    this.loginRequired = function() {
        var deferred = $q.defer();
        if (this.isAuthenticated()) {
            deferred.resolve();
        } else {
            $location.path('/login');
        }
        return deferred.promise;
    }
});

