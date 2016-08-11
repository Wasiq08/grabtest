Array.prototype.toURL = function() {
    return this.join('/');
};

var toQueryString = function(obj) {
    var out = new Array();
    for (key in obj) {
        out.push(key + '=' + encodeURIComponent(obj[key]));
    }
    return out.join('&');
};

angular.module('CoreApi', ['CoreApiUtilities'])

.constant('lagConfig', {
    appName: 'FoodMonger',
    appVersion: '1.0.0',
    apiUrl: 'http://162.243.119.60:3000/'
        // apiUrl: 'http://192.168.1.38:30001/'

})

.factory('httpService', ['$http', 'lagConfig', 'Utils', function($http, lagConfig, Utils) {
    return {
        $http: $http,
        lagConfig: lagConfig,
        Utils: Utils
    }
}])

.service('User', ['httpService', function(httpService) {
    this.login = function(param) {
        var config = httpService.Utils.getHeader();
        console.log("in config", config)
        var url = httpService.Utils.buildUrl(new Array('login'));
        return httpService.$http.post(url, param, config);
    }

    this.register = function(param) {
        var url = httpService.Utils.buildUrl(new Array('register'));
        return httpService.$http.post(url, param, {});
    }

    this.consumer_answers = function(params) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('consumer', 'answers'));
        return httpService.$http.post(url, params, config);
    }

    this.updateprofile = function(params, uid) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('update', uid, 'profile'));
        return httpService.$http.post(url, params, config);
    }

    this.getUser = function(id) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('consumer', id));
        return httpService.$http.get(url, config);
    }

    this.getUserPost = function(id) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('user', id, 'post'));
        return httpService.$http.get(url, config);
    }

    this.logout = function() {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('logout'));
        return httpService.$http.post(url, {}, config);
    }
}])

.service('Posts', ['httpService', function(httpService) {
    this.getCategories = function() {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('categories'));
        return httpService.$http.get(url, config);
    }

    this.create = function(params) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('posts'));
        return httpService.$http.post(url, params, config);
    }

    this.get = function(postid) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('posts', postid));
        return httpService.$http.get(url, config);
    }

    this.getAllFeeds = function(urlParams) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('feeds'), urlParams);
        return httpService.$http.get(url, config);
    }

    this.postCategories = function(params) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('categories'));
        return httpService.$http.post(url, params, config);
    }

    this.addLike = function(postid) {
        var config = httpService.Utils.getHeader();
        console.log("config", config)
        var url = httpService.Utils.buildUrl(new Array('posts', postid, 'like'));
        return httpService.$http.post(url, {}, config);
    }

    this.removeLike = function(postid) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('posts', postid, 'unlike'));
        return httpService.$http.delete(url, config);
    }

    this.deletePost = function(postid) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('posts', postid));
        return httpService.$http.delete(url, config);
    }

    this.addComment = function(params, postid) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('posts', postid, 'comments'));
        return httpService.$http.post(url, params, config);
    }

    this.getAllComments = function(postid) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('posts', postid, 'comments'));
        return httpService.$http.get(url, config);
    }

    this.deleteComment = function(postid, commentid) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('posts', postid, 'comments', commentid));
        return httpService.$http.delete(url, config);
    }

    this.insertLocation = function(params) {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('location'));
        return httpService.$http.post(url, params, config);
    }
}])

angular.module('CoreApiUtilities', [])

.factory('Utils', ['lagConfig', 'localStorageService', function(lagConfig, localStorageService) {

    var makeHeader = function() {
        // var config = {
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        //     }
        // }

        // return config;
        var access_token = localStorageService.get('auth_token');
        if (access_token != null) {
            return config = {
                headers: {
                    'x-access-token': access_token
                }
            };
        } else {
            return config = {
                headers: {}
            };
        }
    }

    var makeString = function(queryStringSet) {
        var param = "";
        if (queryStringSet !== false) {
            param += '?' + toQueryString(queryStringSet);
        }
        param = param.substr(1);
        return param;
    }

    var defaultOffsetLimit = { offset: 0, limit: 5 }

    var buildUrl = function(urlSet, queryStringSet, isAuthUrl) {


        queryStringSet = queryStringSet || false;
        if (!isAuthUrl) {
            var url = lagConfig.apiUrl;
        } else {
            var url = lagConfig.apiAuthUrl;
        }

        if (Object.prototype.toString.call(urlSet) === '[object Array]') {
            url += urlSet.toURL();
        }
        if (queryStringSet !== false) {
            url += '?' + toQueryString(queryStringSet);
        }
        return url;
    }

    return {
        getHeader: makeHeader,
        buildUrl: buildUrl,
        defaultOffsetLimit: defaultOffsetLimit,
        getStringParams: makeString
    };
}])
