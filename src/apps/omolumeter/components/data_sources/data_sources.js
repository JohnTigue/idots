(function(){
'use strict';

angular.module('omolumeter.dataSources', []).component('omolumeterDataSources', {
  templateUrl: 'components/data_sources/data_sources.html',
  controllerAs: 'vm',
  controller: ['outbreakService', '$window', function(outbreakService, $window){
    var vm = this;

    console.log('data_sources.js: controller');
    vm.openUrlInNewTab = function urlOpener(anUrl){
      $window.open(anUrl);
      };  

    vm.dataSources = [
      {
      title : 'Data definition specification',
      url : 'https://github.com/JohnTigue/outbreak_time_series/wiki/Outbreak-Time-Series-Specification-Overview',
      buttonLabel : 'Outbreak Time Series Specification' 
      },
      {
      title : 'Time series data source',
      url : 'https://data.hdx.rwlabs.org/dataset/ebola-cases-2014',
      buttonLabel : 'WHO 2016-03-20' 
      },
      {
      title : 'Sit rep data source',
      url : 'http://apps.who.int/gho/athena/xmart/EBOLA_MEASURE/CASES,DEATHS.json?filter=COUNTRY:*;LOCATION:-;DATAPACKAGEID:2016-03-30;INDICATOR_TYPE:SITREP_CUMULATIVE;INDICATOR_TYPE:SITREP_CUMULATIVE_21_DAYS',
      buttonLabel : 'WHO situation report 2016-03-20' 
      },
      {
      title : 'CSV loaded during initialization',
      url : outbreakService.timeSeriesDataUrl,
      buttonLabel : outbreakService.timeSeriesDataUrl
      }
    ];
  }
  ]});
})(); 
