(function(){
'use strict';

angular.module('omolumeter.sidenav', [])
.component('omolumeterSideNav', {
  templateUrl: 'components/sidenav/sidenav.html', //'sidenav!',
  controllerAs: 'vm',
  require:{
    omolumeter: "^omolumeter"
    },
  bindings: { $router: '<' },
  controller: ['$mdMedia', '$mdSidenav', '$log', '$rootRouter', function($mdMedia, $mdSidenav, $log, $rootRouter){
    var vm = this;

    vm.toggleMainNav = function (){
      console.log('sidenav.toggleMainNav(): DOES NOTHINGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG');
      //$mdSidenav('mainNav').toggle();      
      };

    vm.closeMainNav = function(){
      if($mdSidenav('mainNav').isLockedOpen()){
        $mdSidenav('mainNav').then(function(){
	    
	});
        }
      $mdSidenav('mainNav').close();              	  
      };

    vm.isSideNavLockedOpen = $mdMedia('gt-sm');
	
    vm.navigate = function(aRouteName){
      //hackOutletsHeight();
      $mdSidenav('mainNav').close();      
      $rootRouter.navigate([aRouteName]);
      $log.log('navigated');
      //$rootRouter.navigate(['Informational']);
      //vm.$router.navigate(['Informational']);
    };



    function hackOutletsHeight(){
	var desiredHeight = '10000px'; //(window.getComputedStyle(document.getElementById('theNgOutlet'),null).getPropertyValue("height"));
      console.log('hackOutletsHeight(): ' + desiredHeight);
      document.getElementById('theNgOutlet').style.height =  desiredHeight;
      }


      
    vm.isSidenavToBeLockedOpen = $mdMedia('gt-sm');
  }]
  });
})();
