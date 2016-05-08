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
      title : 'code which reads Outbreak Time Series Spec files',
      url : 'https://github.com/JohnTigue/outbreak_time_series/wiki/outbreak_time_series_reader-module',
      buttonLabel : 'outbreak_time_series_reader module' 
      },
      {
      title : 'JavaScript application framework',
      url : 'http://angularjs.blogspot.com/2016/02/angular-150-ennoblement-facilitation.html',
      buttonLabel : 'Angular 1.5' 
      },    
      {
      title : 'CSV parser',
      url : 'https://www.npmjs.com/package/angular-dsv',
      buttonLabel : 'angular-dsv (part of D3.js)' 
      },
      {
      title : 'Paginated table UI',
      url : 'http://danielnagy.me/md-data-table/',
      buttonLabel : 'Material Design Data Table' 
      },
      {
      title : 'Flags',
      url : 'https://github.com/lipis/flag-icon-css',
      buttonLabel : 'flag-icon-css' 
      },
      {
      title : 'Charts',
      url : 'http://jettro.github.io/c3-angular-directive/',
      buttonLabel : 'C3JS Angular directives' 
      },
      {
      title : 'Maps',
      url : 'http://leafletjs.com/',
      buttonLabel : 'Leaflet' 
      }      
    ];
    }
  ]});  
})();
