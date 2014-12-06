'use strict';

angular.module("ngAutocomplete", ["ng"])
 .directive("objectAutocomplete", ["$compile", "$timeout", "$document", function ($compile, $timeout, $document) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            searchCallback: '=',
            attributeName: '=?',
            searchDelay: '=?',
            maxResultSize: '=?',
            ngModel: '=',
            attrClass: '@',
            attrPlaceholder: '@',
        },
        template: "<span class='livesearch'><input type='text' class='{{attrClass}}' placeholder='{{ attrPlaceholder }}' ng-blur='blurInput()' /></span>",
        link: function ($scope, element, attrs, controller) {
            var timeout;
            var minLen = 1;
            var maxLen = 9;
            var inputElement;
            $scope.attrClass = $scope.attrClass || '';
            $scope.results = [];
            $scope.visible = false;
            $scope.selectedIndex = -1;

            $document.on("click", function () {
              $scope.$apply(function() {
                $scope.$eval($scope.hideResults);
              });
            });

            $scope.hideResults = function() {
                $scope.visible = false;
            };

            $scope.blurInput = function() {
                $scope.ngModel = {};
            };

            $scope.select = function (index) {
                $scope.selectedIndex = index;
                $scope.visible = false;
            };

            $scope.isSelected = function (index) {
                return ($scope.selectedIndex === index);
            };

            $scope.setVal = function(val) {
                if(attrs.attributeName)
                    inputElement.val(val[attrs.attributeName]);
                else
                    inputElement.val(val);
            };

            $scope.init = function() {
                
                inputElement = element.find("input");

                if($scope.ngModel) {
                    $scope.setVal($scope.ngModel);
                }

                $scope.$watch("ngModel", function(val) {
                    inputElement.val(val[attrs.attributeName]);
                });

                $scope.$watch("selectedIndex", function(newValue, oldValue) {
                    var item = $scope.results[newValue];
                    if(item) {
                        if(attrs.attributeName) {
                            inputElement.val(item[attrs.attributeName]);
                        } else {
                            inputElement.val(item);
                        }
                    }
                    if(item)
                        $scope.ngModel = item;
                });

                $scope.$watch("visible", function(newValue, oldValue) {
                    if(newValue == false) {
                        return;
                    }
                });

                inputElement[0].onkeydown = function (e) {
                    //keydown
                    if (e.keyCode == 40) {
                        if($scope.selectedIndex + 1 === $scope.results.length) {
                            $scope.selectedIndex = 0;
                        }
                        else {
                            $scope.selectedIndex++;
                        }
                    }
                    //keyup
                    else if (e.keyCode == 38) {
                        if($scope.selectedIndex == 0) {
                            $scope.selectedIndex = $scope.results.length - 1;    
                        }
                        else if($scope.selectedIndex == -1) {
                            $scope.selectedIndex = 0;
                        }
                        else $scope.selectedIndex--;
                    }
                    //keydown or keyup
                    if (e.keyCode == 13) {
                        $scope.visible = false;
                        e.stopPropagation();
                        e.preventDefault();

                    }

                    //unmanaged code needs to force apply
                    $scope.$apply();
                };

                inputElement[0].onkeyup = function (e) {
                    if (e.keyCode == 13 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
                        e.stopPropagation();
                        e.preventDefault();
                        return false;
                    }
                    var target = element.find("input");
                    // Set Timeout
                    $timeout.cancel(timeout);
                    // Set Search String
                    var vals = target.val().split(",");
                    var search_string = vals[vals.length - 1].trim();
                    // Do Search
                    if (search_string.length < minLen || search_string.length > maxLen) {
                        $scope.visible = false;
                        //unmanaged code needs to force apply
                        $scope.$apply();
                        return;
                    }
                    timeout = $timeout(function () {
                        var results = [];
                        var promise = $scope.searchCallback.call(null, { query: search_string });
                        promise.then(function (dataArray) {
                            if (dataArray) {
                                results = dataArray.slice(0, ($scope.maxResultSize || 20) - 1);
                            }
                            if(results.length)
                                $scope.visible = true;
                        });
                        promise.finally(function() {
                            $scope.selectedIndex = -1;
                            $scope.results = results.filter(function(elem, pos) {
                                return results.indexOf(elem) == pos;
                            });
                        });
                    }, $scope.searchDelay || 100);
                };
            };

            var itemTemplate = element.attr("result-template") || "{{result}}";
            var template = "<ul ng-show='visible && results.length' class='searchresultspopup'><li ng-class=\"{ 'selected' : isSelected($index) }\" ng-click='select($index)' ng-repeat='result in results'>" + itemTemplate + "</li></ul>";
            var searchPopup = $compile(template)($scope);
            element.append(searchPopup[0]);
            $timeout($scope.init);
        }
    };
}]);
