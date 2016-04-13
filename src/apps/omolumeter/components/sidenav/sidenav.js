(function(){
'use strict';

angular.module('omolumeter.sidenav', [])
.component('omolumeterSideNav', {
  templateUrl: 'components/sidenav/sidenav.html', //'sidenav!',
  controllerAs: 'vm',
  bindings: { $router: '<' },
  controller: ['$mdMedia', '$mdSidenav', '$log', '$rootRouter', function($mdMedia, $mdSidenav, $log, $rootRouter){
    var vm = this;

    vm.toggleMainNav = function (){
      console.log('sidenav.toggleMainNav()');
      //$mdSidenav('mainNav').toggle();      
      };

    vm.navigate = function(aRouteName){
      $mdSidenav('mainNav').close();      
      $rootRouter.navigate([aRouteName]);
      $log.log('navigated');
      //$rootRouter.navigate(['Informational']);
      //vm.$router.navigate(['Informational']);
    };
    
    vm.isSidenavToBeLockedOpen = $mdMedia('gt-sm');
  }]
  });
})();
