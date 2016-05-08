(function(){
'use strict';
  
var omolumeterApp = angular.module('omolumeterApp', [
  'gridshore.c3js.chart',
  'hc.dsv',
  'omolumeter.bibliography',
  'omolumeter.dataSources',
  'omolumeter.epicurves',
  'omolumeter.geopolitic',
  'omolumeter.introduction',
  'omolumeter.rawdata',
  'omolumeter.sidenav',
  'omolumeter.timeSeriesTable',
  'omolumeter.titleBar',
  'ngComponentRouter',
  'ngMaterial',
  'md.data.table'
  ]);

    
// Stock config for app having / URLs, not # URLs
omolumeterApp.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
  }]);

omolumeterApp.config(['$compileProvider', '$mdIconProvider', '$mdThemingProvider', function ($compileProvider, $mdIconProvider, $mdThemingProvider) {
  'use strict';
  $compileProvider.debugInfoEnabled(false);

  $mdIconProvider
    //.defaultIconSet("svg/ic_menu_black_24px.svg", 128) // JFT-TODO: default what?
    .icon("menu",     'svg/md_icons/ic_menu_black_24px.svg', 24)
    .icon("settings", 'svg/md_icons/ic_settings_black_24px.svg', 24)
    .icon("omolu",    'svg/md_icons/ic_brightness_low_black_24px.svg', 24)
    .icon("close",    'svg/md_icons/ic_close_black_24px.svg', 24);
    
  $mdThemingProvider.theme('default')
    .primaryPalette('grey')
    .accentPalette('orange');
  }]);
  // JFT-TODO: pre-cache icons: https://material.angularjs.org/latest/demo/icon
  /* .run(function($http, $templateCache) {
    var urls = [
      'img/icons/sets/core-icons.svg',
      'img/icons/cake.svg',
      'img/icons/android.svg'
    ];
    // Pre-fetch icons sources by URL and cache in the $templateCache...
    // subsequent $http calls will look there first.
    angular.forEach(urls, function(url) {
      $http.get(url, {cache: $templateCache});
    });
    })*/

  
// Set up $routerRootComponent:
omolumeterApp.component('omolumeter', {
  templateUrl: 'components/omolumeter/omolumeter.html', 
  $routeConfig: [
    {path:'/introduction', name:'Informational',           component:'introduction',          useAsDefault: false},
    {path:'/epicurves',    name:'Epicurves',               component:'epicurves',             useAsDefault: true },
    {path:'/timeseries',   name:'OutbreakTimeSeriesTable', component:'timeSeriesTable',       useAsDefault: false},
    {path:'/rawdata',      name:'RawDataTable',            component:'rawDataTable',          useAsDefault: false},
    {path:'/data_sources', name:'DataSources',             component:'omolumeterDataSources', useAsDefault: false},
    {path:'/bibliography', name:'Bibliography',            component:'bibliography',          useAsDefault: false}
  ]});
omolumeterApp.value('$routerRootComponent', 'omolumeter');

  
// For paginating data clientside, called on in table-body's ngRepeat
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
  
})();
