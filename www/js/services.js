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

