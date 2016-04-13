(function(){
'use strict';
  

var omolumeterApp = angular.module('omolumeterApp', [
  'omolumeter.bibliography',
  'omolumeter.introduction',
  'omolumeter.rawdata',
  'omolumeter.sidenav',
  'omolumeter.titleBar',
  'ngComponentRouter',
  'ngMaterial',
  'md.data.table',
  'hc.dsv']);

// Stock config for app having / URLs, not # URLs
omolumeterApp.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
}]);

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


  
  
// Set up $routerRootComponent:
omolumeterApp.component('omolumeter', {
  templateUrl: 'components/omolumeter/omolumeter.html', 
  $routeConfig: [
    {path:'/introduction', name:'Informational', component:'introduction', useAsDefault: true},
    {path:'/rawdata',      name:'RawDataTable',  component:'rawDataTable', useAsDefault: false},
    {path:'/bibliography', name:'Bibliography', component:'bibliography', useAsDefault: false}
  ]});
omolumeterApp.value('$routerRootComponent', 'omolumeter');

/*  
angular.module('informational', [])
.component('informational', {
  template: '<ng-outlet></ng-outlet>',
  $routeConfig: [
    {path: '/intro',        name: 'Introduction', component: 'introduction', useAsDefault: true},
    {path: '/bibliography', name: 'Bibliography', component: 'bibliography'}
  ]
})

angular.module('views', [])
.component('views', {
  template: '<h2>views</h2><ng-outlet></ng-outlet>',
  $routeConfig: [
    {path: '/',    name: 'ViewList',   component: 'ViewList', useAsDefault: true},
    {path: '/datatable', name: 'HeroDetail', component: 'heroDetail'}
    ]
  })
*/

  
  
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
