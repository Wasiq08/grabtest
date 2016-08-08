angular.module('app.directives', [])

.directive('blankDirective', [function(){

}])

.directive('readableTimeFilter', ['$timeout', function($timeout) {
    function update(scope) {
        var seconds = scope.time;
        scope.converted = readableTime(seconds);
        $timeout(function() { update(scope); }, 60000);
    }

    function readableTime(seconds) {
        var day, format, hour, minute, month, week, year;
        var currentTime = Math.floor(Date.now() / 1000);
        seconds = parseInt((currentTime - seconds));
        minute = 60;
        hour = minute * 60;
        day = hour * 24;
        week = day * 7;
        year = day * 365;
        month = year / 12;
        format = function(number, string) {
            if (string == 'day' || string == 'week' || string == 'hr') {
                string = number === 1 ? string : "" + string + "s";
            }
            //string = number === 1 ? string : "" + string + "s";
            return "" + number + " " + string;
        };
        switch (false) {
            case !(seconds < minute):
                return 'few secs ago';
            case !(seconds < hour):
                return format(Math.floor(seconds / minute), 'min');
            case !(seconds < day):
                return format(Math.floor(seconds / hour), 'hr');
            case !(seconds < week):
                return format(Math.floor(seconds / day), 'day');
            case !(seconds < month):
                return format(Math.floor(seconds / week), 'week');
            case !(seconds < year):
                return format(Math.floor(seconds / month), 'mon');
            default:
                return format(Math.floor(seconds / year), 'yr');
        }
    };
    return {
        restrict: 'A',
        scope: {
            time: '=time',
            converted: '=converted'
        },
        link: function(scope, element, attrs) {
            update(scope);
            scope.$watch('time', function(value) {
                update(scope);
            });
        }
    };
}])

.filter('readableTime', function() {
    return function(seconds) {
        var day, format, hour, minute, month, week, year;
        var currentTime = Math.floor(Date.now() / 1000);
        seconds = parseInt((currentTime - seconds));
        minute = 60;
        hour = minute * 60;
        day = hour * 24;
        week = day * 7;
        year = day * 365;
        month = year / 12;
        format = function(number, string) {
            if (string == 'day' || string == 'week' || string == 'hr') {
                string = number === 1 ? string : "" + string + "s";
            }
            //string = number === 1 ? string : "" + string + "s";
            return "" + number + " " + string;
        };
        switch (false) {
            case !(seconds < minute):
                return 'few seconds ago';
            case !(seconds < hour):
                return format(Math.floor(seconds / minute), 'min');
            case !(seconds < day):
                return format(Math.floor(seconds / hour), 'hr');
            case !(seconds < week):
                return format(Math.floor(seconds / day), 'day');
            case !(seconds < month):
                return format(Math.floor(seconds / week), 'week');
            case !(seconds < year):
                return format(Math.floor(seconds / month), 'mon');
            default:
                return format(Math.floor(seconds / year), 'yr');
        }
    };
})