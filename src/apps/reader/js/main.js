var aDemoApp = angular.module('mdDataTableDemo', ['ngMaterial', 'md.data.table']);

aDemoApp.config(['$compileProvider', '$mdThemingProvider', function ($compileProvider, $mdThemingProvider) {
    'use strict';
    
    $compileProvider.debugInfoEnabled(false);
    
    $mdThemingProvider.theme('default')
      .primaryPalette('indigo')
      .accentPalette('blue-grey');
  }]);


// straight from the docs: https://github.com/daniel-nagy/md-data-table
aDemoApp.controller('dataTableController', ['dumdum', '$scope', function (dumdum, $scope) {
  'use strict';

  $scope.selected = [];

  $scope.query = {
    order: 'name',
    limit: 5,
    page: 1
  };

  function getDesserts(query) {
    $scope.promise = dumdum; //pre-jft: $nutrition.desserts.get(query, success).$promise;
    success(dummyDesserts);
  }

  function success(desserts) {
    $scope.desserts = desserts;
  }

  $scope.onPaginate = function (page, limit) {
    getDesserts(angular.extend({}, $scope.query, {page: page, limit: limit}));
  };

  $scope.onReorder = function (order) {
    getDesserts(angular.extend({}, $scope.query, {order: order}));
  };

    getDesserts($scope.query);  

    /*
    This was durnig dev: don't want an unnecessary watch so just called getDesserts() during the controllers init, i.e. added the previous line of code above here. 
    $scope.$watch('query.order', function dummy( newVal, oldVal ) {
    // query.order is dummy value. Doing this just to get the init data load working
    getDesserts($scope.query);  
    });
    */
    
}]);


var dummyDesserts = {};
dummyDesserts.data = [
      { name: 'a', calories: {value: '11'}, fat: 'Liberia', carbs: {value:'3'}, protein: {value:'4'}, sodium: {value:'5'}, calcium: {value:'6', units:'b'}, iron: {value:'7', units: 'c'} },
      { name: 'b', calories: {value: '12'}, fat: 'Guinea', carbs: {value:'3'}, protein: {value:'4'}, sodium: {value:'5'}, calcium: {value:'6', units:'b'}, iron: {value:'7', units: 'c'} },
      { name: 'c', calories: {value: '13'}, fat: 'Guinea', carbs: {value:'3'}, protein: {value:'4'}, sodium: {value:'5'}, calcium: {value:'6', units:'b'}, iron: {value:'7', units: 'c'} },
      { name: 'd', calories: {value: '1d4'}, fat: 'Sierra Leone', carbs: {value:'3'}, protein: {value:'4'}, sodium: {value:'5'}, calcium: {value:'6', units:'b'}, iron: {value:'7', units: 'c'} }
    ];


aDemoApp.factory( 'dumdum', ['$q', function ($q){
  return $q.resolve(dummyDesserts);
  }]);


console.log('finished parsing main.js');

