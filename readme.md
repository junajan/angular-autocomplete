angular-live-search
===========
 - Clone of https://github.com/mauriciogentile/angular-livesearch but with added css styles and bower hook.. cheers!

##Usage

### Markup

```html
<div ng-controller='MyController'>
 <autocomplete id="search1" type="text"
search-callback="mySearchCallback"
result-template="{{result.city}}<strong>{{result.state}}</strong><b>{{result.country}}</b>"
attribute-name="fullName"
ng-model="mySearch"></autocomplete>
</div>
```

### Controller

```js
//define app module with dependency
var app = angular.module("MyApp", ["ngAutocomplete"]);
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
