(function(){
'use strict';

angular.module('omolumeter.rawdata', [])
.component('rawDataTable', {
  templateUrl: 'components/rawdata/rawdata.html',
  controllerAs: 'vm',
  $routerCanReuse: function(){return true},
  controller: ['outbreakService', 'dsv', '$mdMedia', '$log', function (outbreakService, dsv, $mdMedia, $log) {  
  'use strict';

  $log.log('rawDataTable component controller function.');
  var vm = this;
        
  vm.timeSeriesPromise = outbreakService.timeSeriesPromise;

  vm.onReorder = function (order) {
    };
  
  // Pagination:
  vm.onPaginate = function (page, limit) {
    //$log.log('onPaginate('+page+', '+limit+')');
    //vm.pagination.page = page;
    //vm.pagination.limit = limit;
    };
  vm.pageSizeOptionsArray = [10, 25, 100];
  vm.pagination = {
    order: 'country',
    limit: 10,
    page: 1
    };

  // Connect parsed CSV to md-data-table
    console.log('aliave');
  console.log('promise=' + outbreakService.timeSeriesPromise );
  outbreakService.timeSeriesPromise.then(function(csvRows){console.log('hi')});
  outbreakService.timeSeriesPromise.then(function(csvRows){
    $log.log('rawdata.js: Time series load by outbreakService Promise.then(): rowCount=' + csvRows.length + '. First row:');
    for( var i = 0; i < 1; i++){
      console.log(csvRows[i]);
      }
    // JFT-TODO: why not jut return the data? What value does rowCount add? Maybe on a higher level API of outbreak but not of raw CSV
    var csvModel = {rowCount: csvRows.length, data: csvRows};
    vm.csvTable = csvModel; 
  }, function(){$log.error( 'rawdata.js: time series load error():' );});
      
/*
      .success(function(data, status, headers, config) {
      $log.log('Time series load by dsv.csv success(): rowCount=' + data.length + '. First row:');
      for( var i = 0; i < 1; i++){
	console.log(data[i]);
	}
      // JFT-TODO: why not jut return the data? What value does rowCount add? Maybe on a higher level API of outbreak but not of raw CSV
      var csvModel = {rowCount: data.length, data: data};
      vm.csvTable = csvModel; 
    })
    .error(function(data, status, headers, config) {
      $log.error( 'dsv.csv error():' + status + headers + config + data );
      });
*/
    
      }
  ]});
})();
