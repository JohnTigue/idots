(function(){
  'use strict';
  
var omolumeterApp = angular.module('mdDataTableDemo', ['ngMaterial', 'md.data.table', 'hc.dsv']);

// Constants
// header: Indicator,Country,Date,value
var aCsvFileRelativeUrl = '../../../test/data/ebola_2014/ebola_data_db_format.1000_rows.csv';

omolumeterApp.config(['$compileProvider', '$mdIconProvider', '$mdThemingProvider', function ($compileProvider, $mdIconProvider, $mdThemingProvider) {
  'use strict';
    
  $compileProvider.debugInfoEnabled(false);

  $mdIconProvider
    .defaultIconSet("../../assests/svg/ic_menu_black_24px.svg", 128) // JFT-TODO: default what?
    .icon("menu"  , '../../assests/svg/ic_menu_black_24px.svg', 24);
  
  $mdThemingProvider.theme('default')
    .primaryPalette('grey')
    .accentPalette('red');
  }]);
  
  
var DataTableController = function (outbreakTimeSeriesFactory, dsv, $scope, $window, $mdSidenav, $mdMedia, $log) {  
  'use strict';

  var vm = this;
  
  // hide "loading..." UI
  document.querySelector('#appInitializingDialog').style.display = 'none';
  
  $scope.isDataStillLoading = true;
  $scope.dataUrl = aCsvFileRelativeUrl;
  
  $scope.selected = [];

  $scope.query = {
    order: 'country',
    limit: 5,
    page: 1
    };

  $scope.openUrlInNewTab = function urlOpener(anUrl){
    $window.open(anUrl);
    };
  
  $scope.techDetails = [
    {
    title : 'Specification definition',
    url : 'https://github.com/JohnTigue/outbreak_time_series/wiki/Outbreak-Time-Series-Specification-Overview',
    buttonLabel : 'Outbreak Time Series Specification' 
    },
    {
    title : 'Data source',
    url : 'https://data.hdx.rwlabs.org/dataset/ebola-cases-2014',
    buttonLabel : 'WHO 2016-03-20' 
    },
    {
    title : 'CSV loaded during initialization',
    url : $scope.dataUrl,
    buttonLabel : $scope.dataUrl 
    },
    {
    title : 'code which reads Outbreak Time Series Spec files',
    url : 'https://github.com/JohnTigue/outbreak_time_series/wiki/outbreak_time_series_reader-module',
    buttonLabel : 'outbreak_time_series_reader module (JavaScript)' 
    },
    {
    title : 'JavaScript Framework',
    url : 'http://angularjs.blogspot.com/2016/02/angular-150-ennoblement-facilitation.html',
    buttonLabel : 'Angular 1.5' 
    },    
    {
    title : 'CSV parser',
    url : 'https://www.npmjs.com/package/angular-dsv',
    buttonLabel : 'angular-dsv (part of D3.js)' 
    },
    {
    title : 'Table UI',
    url : 'http://danielnagy.me/md-data-table/',
    buttonLabel : 'Material Design Data Table' 
    }
  ];

  
  function startFetchOfOutbreakTimeSeries(junk) {
    var rowCount = 0;

    // JFT-TODO why return, or better why nothing being done with what is returned?
    return dsv.csv({method: 'GET', url: aCsvFileRelativeUrl}, function(d) {
      rowCount++;
      if( rowCount < 2 ) {
	console.log('sample row:');
	console.log(d);
        }
      return { indicator: d.Indicator, country: d.Country, date: new Date(d.Date), value: parseInt(d.value) };
      })
      .success(function(data, status, headers, config) {
        console.log('dsv.csv success. rowCount=' + rowCount + '. First 4 rows:');
	for( var i = 0; i < 4; i++){
   	  console.log(data[i]);
	  }
	var parseResults = {rowCount: rowCount, data: data};
        onSuccessfulDataParse(parseResults);
        $scope.isDataStillLoading = false;
      })
      .error(function(data, status, headers, config) {
        console.error( 'dsv.csv error' + status + headers + config + data );
        $scope.isDataStillLoading = false;
        });
    }
      
  // JFT-TODO: dead, so kill
  function getOutbreakTimeSeries(query) {
    $scope.promise = outbreakTimeSeriesFactory; //pre-jft: $nutrition.desserts.get(query, success).$promise;
    onSuccessfulDataParse(dummyOutbreakTimeSeries);
  }

  function onSuccessfulDataParse(anOutbreakTimeSeries) {
    console.log('onSuccessfulDataParse() called, passing data to $scope. Which will start rendering of many rows...');
    $scope.dataPoints = anOutbreakTimeSeries;
  }

  vm.onHamburgerClick = function (){
    console.log('toggling main nav, was ' + $scope.isSidenavToBeLockedOpen );
    if( $mdSidenav('mainNav').isLockedOpen() ) {
      $scope.isSidenavToBeLockedOpen = false;
      $mdSidenav('mainNav').close();
      } else {
        $mdSidenav('mainNav').toggle();
        }  
    
    //$scope.isSidenavToBeLockedOpen = !$scope.isSidenavToBeLockedOpen;
    };

  $scope.isSidenavToBeLockedOpen = $mdMedia('gt-sm');
  
  vm.onPaginate = function (page, limit) {
    startFetchOfOutbreakTimeSeries(angular.extend({}, $scope.query, {page: page, limit: limit}));
  };

  vm.onReorder = function (order) {
    startFetchOfOutbreakTimeSeries(angular.extend({}, $scope.query, {order: order}));
  };

  // start init load of data
  
  (function (){startFetchOfOutbreakTimeSeries($scope.query);})();

  /*
  This was durnig dev: don't want an unnecessary watch so just called getDesserts() during the controllers init, i.e. added the previous line of code above here. 
  $scope.$watch('query.order', function dummy( newVal, oldVal ) {
  // query.order is dummy value. Doing this just to get the init data load working
  getDesserts($scope.query);  
  });
  */
}
  
DataTableController.$inject = ['dummyOutbreakTimeSeriesFactory', 'dsv', '$scope', '$window', '$mdSidenav', '$mdMedia', '$log' ];

  
omolumeterApp.controller('DataTableController', DataTableController);
  


  
  

omolumeterApp.controller('MainNavController', function($scope, $mdSidenav) {
  $scope.openMainMenu = function() {
    $mdSidenav('mainNav').toggle();
  };
});




  


/*******************  OutbreakTimeseriesService ****************************/

/* OTService is an Angular data service. App accesses OTSS data model through APIs and
 * OTService will fetch and parse Resources as needed and cache instantiated objects of data model.
 *
 */
omolumeterApp.factory('OutbreakTimeSeriesService', ['$http', function($http){
  return {
    getTimeseries: function(){
      return $http.get(aCsvFileRelativeUrl).then(function(response){
	return response.data;
        })
      }			      
    };
  }]);


// JFT-TODO: This should actually come from parsing the CSV, but this will do during dev...
var dummyOutbreakTimeSeries = {};
dummyOutbreakTimeSeries.data = [
  {_id: 'row1', indicator: "Cumulative number of probable Ebola deaths", country: 'Liberia', date: "2016-03-27", value: "1"},
  {_id: 'row2', indicator: "Cumulative number of probable Ebola deaths", country: 'Sierra Leone', date: "2016-03-27", value: "2"},
  {_id: 'row3', indicator: "Cumulative number of confirmed Ebola deaths", country: 'Ginnea', date: "2016-03-27", value: "3"},
  {_id: 'row4', indicator: "Cumulative number of confirmed, probable and suspected Ebola deaths", country: 'Sierra Leone', date: "2016-03-28", value: "5"}
  ];

omolumeterApp.factory( 'dummyOutbreakTimeSeriesFactory', ['$q', function ($q){
  return $q.resolve(dummyOutbreakTimeSeries);
  }]);



//console.log('finished parsing main.js');

})();
