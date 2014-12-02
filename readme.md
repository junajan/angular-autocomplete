angular-live-search
===========
 - Clone of https://github.com/mauriciogentile/angular-livesearch but with added css styles and bower hook.. cheers!

##Usage

### Markup

```html
<div ng-controller='MyController'>
<live-search id="search1" type="text"
  live-search-callback="mySearchCallback"
  live-search-item-template="{{result.city}}<strong>{{result.state}}</strong><b>{{result.country}}</b>"
  live-search-select="fullName"
  ng-model="search1" ></live-search>
</div>
```

### Controller

```js
//define app module with dependency
var app = angular.module("MyApp", ["LiveSearch"]);
app.controller("MyController", function($scope, $http, $q, $window) {
   $scope.search1 = "";
   //your search callback
   $scope.mySearchCallback = function () {
      var defer = $q.defer();
      defer.resolve([
        { city: "nailuva", state: "ce", country: "fiji"},
        { city: "suva", state: "ce", country: "fiji"}
      ]);
      return defer.promise;
   };
});
```
