(function(){
'use strict';
  

var omolumeterApp = angular.module('mdDataTableDemo', ['ngMaterial', 'md.data.table', 'hc.dsv']);
  
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
  

omolumeterApp.controller('MainNavController', function($scope, $mdSidenav) {
  $scope.openMainMenu = function() {
    $mdSidenav('mainNav').toggle();
    };
  });


// For paginating data clientside, called on in table body's ngRepeat
// http://fdietz.github.io/recipes-with-angular-js//common-user-interface-patterns/paginating-through-client-side-data.html
omolumeterApp.filter('offset', function() {
  return function(input, start) {
    start = parseInt(start, 10);
    if(input)
      return input.slice(start);
    else
      return [];
  };
});  

  
/**** DataTableController.js *****************************************************************************/
  
var DataTableController = function (outbreakService, dsv, $scope, $window, $mdSidenav, $mdMedia, $log) {  
  'use strict';

  var vm = this;
  
  // hide "loading..." UI
  document.querySelector('#appInitializingDialog').style.display = 'none';  
  $scope.isDataStillLoading = true;

  $scope.dataUrl = outbreakService.dataUrl;
  
  $scope.selected = [];

  $scope.query = {
    order: 'country',
    limit: 10,
    page: 1
    };

  vm.pageSizeOptionsArray = [10, 25, 100];
  
  vm.onHamburgerClick = function (){
    console.log('toggling main nav, was ' + $scope.isSidenavToBeLockedOpen );
    if( $mdSidenav('mainNav').isLockedOpen() ) {
      $scope.isSidenavToBeLockedOpen = false;
      $mdSidenav('mainNav').close();
      } else {
        $mdSidenav('mainNav').toggle();
        }      
    };
  $scope.isSidenavToBeLockedOpen = $mdMedia('gt-sm');
  // for some reason had to go $scope, not vm?

  function startFetchOfOutbreakTimeSeries(junk) {
    $scope.timeSeriesPromise = outbreakService.timeSeriesPromise;
    outbreakService.timeSeriesPromise
      .success(function(data, status, headers, config) {
        $log.log('dsv.csv success(): rowCount=' + outbreakService.rowCount + '. First row:');
        for( var i = 0; i < 1; i++){
          console.log(data[i]);
          }
        var parseResults = {rowCount: data.length, data: data};
        onSuccessfulDataParse(parseResults);
        $scope.isDataStillLoading = false;
      })
      .error(function(data, status, headers, config) {
        $log.error( 'dsv.csv error():' + status + headers + config + data );
        $scope.isDataStillLoading = false;
        });
    }
      
  function onSuccessfulDataParse(anOutbreakTimeSeries) {
    console.log('onSuccessfulDataParse() called after parsing ' + anOutbreakTimeSeries.rowCount + ' rows. Passing data to $scope now...');
    $scope.dataPoints = anOutbreakTimeSeries;
    }


  vm.onPaginate = function (page, limit) {
    };

  vm.onReorder = function (order) {
    };


  
  /**** FurtherReadingComponent *******************/
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

  // start init load of data
  (function (){
     startFetchOfOutbreakTimeSeries($scope.query);
     })();
  }

  
DataTableController.$inject = ['outbreakService', 'dsv', '$scope', '$window', '$mdSidenav', '$mdMedia', '$log' ];

omolumeterApp.controller('DataTableController', DataTableController);

/**** End of DataTableController.js *********************************/

  


  

/*******************  OutbreakTimeSeriesService.js ****************************/
/* outbreakService is an Angular data service. App accesses an OTSS data model through APIs.
 * outbreakService will fetch and parse Resources as needed and cache instantiated objects of data model.
 */
// Config constants:
// JFT-TODO: this could be an angular.value() or angular.constant() and defined in main.js?
// From HDX, CSV headers are: Indicator,Country,Date,value
var timeSeriesDataDocUrl = '../../../test/data/ebola_2014/ebola_data_db_format.1000_rows.csv';

  var whoSituationReportDataDocUrl = '../../../test/data/ebola_2014/who_sit_rep.2016_03.json';
//var whoSituationReportDataDocUrl = 'http://apps.who.int/gho/athena/xmart/EBOLA_MEASURE/CASES,DEATHS.json?filter=COUNTRY:*;LOCATION:-;DATAPACKAGEID:2016-03-30;INDICATOR_TYPE:SITREP_CUMULATIVE;INDICATOR_TYPE:SITREP_CUMULATIVE_21_DAYS';


omolumeterApp.factory('outbreakService', ['dsv', '$http', '$log', function(dsv, $http, $log){
  // Set up timeSeries
  var timeSeries = {};
  timeSeries.promise = null;
  timeSeries.dataUrl = "";
  var loadTimeSeries = function(anOtssDocUrl){
    timeSeries.dataUrl = anOtssDocUrl;
    return dsv.csv({method: 'GET', url: anOtssDocUrl}, function(d) {
      return { indicator: d.Indicator, country: d.Country, date: new Date(d.Date), value: parseInt(d.value) };
      })
      // JFT-TODO: dead. kill
      //return $http.get(timeSeriesDataDocUrl).then(function(response){
      //  return response.data;
      //  })
    }			      
  timeSeries.promise = loadTimeSeries(timeSeriesDataDocUrl);

  
  // Set up whoSituationReport, the WHO's sit-rep data in JSON 
  var whoSituationReport = {}
  whoSituationReport.promise = null;
  whoSituationReport.datUrl = null;
  var loadWhoSitRep = function(aSitRepUrl){
    whoSituationReport.dataUrl = aSitRepUrl;
    $log.log( 'whoSituationReport.dataUrl=' + whoSituationReport.dataUrl);
    return $http({method: 'GET', url: whoSituationReport.dataUrl}).then(function(response){
      $log.log( 'loadWhoSitRep() called back: copyright=' + response.data.copyright);
      });
    }			      
  whoSituationReport.promise = loadWhoSitRep(whoSituationReportDataDocUrl);
    
  return {
    timeSeriesPromise: timeSeries.promise,
    whoSituationReportPromise: whoSituationReport.promise 
    };
  }]);
  
})();
