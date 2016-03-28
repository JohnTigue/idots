var aDemoApp = angular.module('mdDataTableDemo', ['ngMaterial', 'md.data.table']);

aDemoApp.config(['$compileProvider', '$mdThemingProvider', function ($compileProvider, $mdThemingProvider) {
    'use strict';
    
    $compileProvider.debugInfoEnabled(false);
    
    $mdThemingProvider.theme('default')
      .primaryPalette('indigo')
      .accentPalette('blue-grey');
  }]);


// straight from the docs: https://github.com/daniel-nagy/md-data-table
aDemoApp.controller('dataTableController', ['dummyOutbreakTimeSeriesFactory', '$scope', function (outbreakTimeSeriesFactory, $scope) {
  'use strict';

  $scope.selected = [];

  $scope.query = {
    order: 'country',
    limit: 5,
    page: 1
  };

  function getOutbreakTimeSeries(query) {
    $scope.promise = outbreakTimeSeriesFactory; //pre-jft: $nutrition.desserts.get(query, success).$promise;
    success(dummyOutbreakTimeSeries);
  }

  function success(anOutbreakTimeSeries) {
    $scope.desserts = anOutbreakTimeSeries;
  }

  $scope.onPaginate = function (page, limit) {
    getOutbreakTimeSeries(angular.extend({}, $scope.query, {page: page, limit: limit}));
  };

  $scope.onReorder = function (order) {
    getOutbreakTimeSeries(angular.extend({}, $scope.query, {order: order}));
  };

  // start init load of data
  getOutbreakTimeSeries($scope.query);  

  /*
  This was durnig dev: don't want an unnecessary watch so just called getDesserts() during the controllers init, i.e. added the previous line of code above here. 
  $scope.$watch('query.order', function dummy( newVal, oldVal ) {
  // query.order is dummy value. Doing this just to get the init data load working
  getDesserts($scope.query);  
  });
  */
    
}]);


// JFT-TODO: This should actually come from parsing the CSV, but this will do during dev...
var dummyOutbreakTimeSeries = {};
dummyOutbreakTimeSeries.data = [
  {_id: 'row1', indicator: "Cumulative number of probable Ebola deaths", country: 'Liberia', date: "2016-03-27", value: "1"},
  {_id: 'row2', indicator: "Cumulative number of probable Ebola deaths", country: 'Sierra Leone', date: "2016-03-27", value: "2"},
  {_id: 'row3', indicator: "Cumulative number of confirmed Ebola deaths", country: 'Ginnea', date: "2016-03-27", value: "3"},
  {_id: 'row4', indicator: "Cumulative number of confirmed, probable and suspected Ebola deaths", country: 'Sierra Leone', date: "2016-03-28", value: "5"}
  ];



aDemoApp.factory( 'dummyOutbreakTimeSeriesFactory', ['$q', function ($q){
  return $q.resolve(dummyOutbreakTimeSeries);
  }]);


console.log('finished parsing main.js');

