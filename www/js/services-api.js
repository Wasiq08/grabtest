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
    apiUrl: 'http://192.168.1.33:3000/'

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

    this.getAllFeeds = function() {
        var config = httpService.Utils.getHeader();
        var url = httpService.Utils.buildUrl(new Array('feeds'));
        return httpService.$http.get(url, config);
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
