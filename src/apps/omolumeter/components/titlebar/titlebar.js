(function(){
'use strict';

angular.module('omolumeter.titleBar', [])
.component('omolumeterTitleBar', {
  templateUrl: 'components/titlebar/titlebar.html', //'sidenav!',
  controllerAs: 'vm',
  bindings: { $router: '<' },
  controller: ['$scope', '$mdMedia', '$mdSidenav', '$log', '$rootRouter', function($scope, $mdMedia, $mdSidenav, $log, $rootRouter){
    var vm = this;

    vm.junk = 'junkier';


    // Set vm.showHamburger, and set a watch (on $scope) for resizes to decide it show/hide hamburger stack on resize 
    vm.showHamburger = $mdMedia('gt-sm');
    $scope.$watch(function() { return $mdMedia('gt-sm'); }, function(isGreaterThanSmall) {
      vm.showHamburger = isGreaterThanSmall;
      });
    /*    
    This is where this button shoud ng-click='vm.onHambugerClick' but that just inter component comm's to side nav component which should know it's business.
      Or maybe this just $mdSidenav('mainNav').toggle() and if locked open then nothing happens


    Maybe there is a right aligned X on sideNav header if sideNav locked open (and hambuger is invisible). Otherwise it's just a hambuger. two different buttons
      So sidenav knows to show X or not.
      navbar knows to show hamburger or not, based on sidenav component's state
      hamburger just does normal shit, if shown
    */

    // JFT-TODO: this belongs on the nav header not on the rawDataTable where it was before parking it here temporarily
    
    vm.onHamburgerClick = function (){
      console.log('titleBar.onHambClick()');
      $mdSidenav('mainNav').toggle();

      /*
      // + $scope.isSidenavToBeLockedOpen );
      // JFT-TODO: this where there should be inter component comm: this guy becomes a component and requre:'^omoluSideNav'
      if( $mdSidenav('mainNav').isLockedOpen() ) {
	$scope.isSidenavToBeLockedOpen = false;
	$mdSidenav('mainNav').close();
        } else {
          $mdSidenav('mainNav').toggle();
          }      
	  */
      };
    //$scope.isSidenavToBeLockedOpen = $mdMedia('gt-sm');
    // for some reason had to go $scope, not vm?
    
    /*
    vm.openMainMenu = function() {
      $log.log('sidenav controller openMainMen()');
      $mdSidenav('mainNav').toggle();
      }
      */  
    }]
  });

})();
