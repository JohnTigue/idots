(function(){
'use strict';

angular.module('omolumeter.bibliography', []).component('bibliography', {
  templateUrl: 'components/bibliography/bibliography.html',
  controllerAs: 'vm',
  controller: ['outbreakService', '$window', function(outbreakService, $window){
    var vm = this;

    console.log('bibliography.js');
    this.openUrlInNewTab = function urlOpener(anUrl){
      $window.open(anUrl);
      };  

    this.techDetails = [
      {
      title : 'Specification definition',
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
    }
  ]});  
})();
