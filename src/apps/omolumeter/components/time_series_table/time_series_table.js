(function(){
'use strict';

angular.module('omolumeter.timeSeriesTable', [])
.component('timeSeriesTable', {
  templateUrl: 'components/time_series_table/time_series_table.html',
  $routerCanReuse: function(){return false},
  controller: ['outbreakService', 'geopoliticService', '$mdToast', '$window', '$scope', '$timeout', '$log',
              function (outbreakService, geopoliticService, $mdToast, $window, $scope, $timeout, $log) {  
    'use strict';
    var $ctrl = this;
    $ctrl.foo = 'bar';

    $ctrl.ngRepeatsHeight = {
      // See setListHeight below
      height: (window.getComputedStyle(document.getElementById('theNgOutlet'),null).getPropertyValue("height"))	
      };

    $ctrl.showToastForCountry = function(aIso3CountryCode, $element){
      console.log('showToastForCountry(' + aIso3CountryCode + '):' );
      $mdToast.show(
        $mdToast.simple()
        .textContent(aIso3CountryCode)
          //.position($scope.getToastPosition())
	  //.parent(
        .hideDelay(3000)
        );
      };

    $ctrl.getCountryNameByIso3Code = function(anIso3Code){
      return geopoliticService.lookupCountryByISO3(anIso3Code).name;
      };

    $ctrl.getPercentageWidthForIndicator = function(anIndicatorValue){
      if(!anIndicatorValue) {
	// console.log( 'missing indicator value')
	return "0%";
        } else {
	  return (100  * anIndicatorValue / $ctrl.maxBarValue) + "%";
	  }
      }
      
      
    this.$onInit = function(){
      console.log('TimeSeriesTable.$onInit(): height of outlet = ' + (window.getComputedStyle(document.getElementById('theNgOutlet'),null).getPropertyValue("height")));
      setListHeight();
      };

    this.$postLink = function(){
      console.log('TimeSeriesTable.$postLink(): height of outlet = ' + (window.getComputedStyle(document.getElementById('theNgOutlet'),null).getPropertyValue("height")));
      //setListHeight();
      // JFT-TODO: this unfortunate hack is needed to get chrome to figure out the height the time series table should be. It's not the right height until after
      // navigation to the component is complete. Oddly, at one time chrome was working but FF and safari were not. So it either C or FF+Saf but not all 3
      // TODO: http://stackoverflow.com/questions/1818474/how-to-trigger-the-window-resize-event-in-javascript/18693617#18693617
      //       This has more cross browser tricks if needed
      $timeout(function(){window.dispatchEvent(new Event('resize'));},1);
      };

    this.$routerOnActivate = function(){
      console.log('TimeSeriesTable.$routerOnActivate(): height of outlet = ' + (window.getComputedStyle(document.getElementById('theNgOutlet'),null).getPropertyValue("height")));
      };

    this.$routeOnReuse = function(){
      console.log('TimeSeriesTable.$routeOnReuse(): height of outlet = ' + (window.getComputedStyle(document.getElementById('theNgOutlet'),null).getPropertyValue("height")));
      };
  
    // A hack to get around md-virtual-repeat needing to have a specific height even though want it to flex to take up all vert space available after header and toolbar
    //   https://github.com/angular/material/issues/4314
    function setListHeight(){
      var desiredHeight = (window.getComputedStyle(document.getElementById('theNgOutlet'),null).getPropertyValue("height"));
      console.log('setListHeight(): ' + desiredHeight);
      $ctrl.ngRepeatsHeight.height = desiredHeight;
	document.getElementById('timeSeriesTableDiv').style.height =  desiredHeight;
	document.getElementById('mdVirtRepeatContainer').style.height =  desiredHeight;
	//kills:document.getElementById('mdVirtRepeat').style.height =  desiredHeight;



	/*	
      // JFT-TODO: kill, no effect b/c components are one way binding. [Does that statement even make sense?]
      // trick Angular into redrawing md-virtual-repeat
      var temp = $ctrl.dateCountryCombos; 
      $ctrl.dateCountryCombos = null;
      $ctrl.dateCountryCombos = temp;

      // JFT-TODO: Kill this too
      $ctrl.ngRepeatsHeight = null;
      $ctrl.ngRepeatsHeight = {
        // See setListHeight below
        height: (window.getComputedStyle(document.getElementById('theNgOutlet'),null).getPropertyValue("height"))	
        };

      document.getElementById('mdVirtRepeatConatiner').style.display='none';
      document.getElementById('mdVirtRepeatConatiner').offsetHeight; // no need to store this anywhere, the reference is enough
      document.getElementById('mdVirtRepeatConatiner').style.display='block';


      fucked things up even more:
	$ctrl.ngRepeatsHeight = {height: '0px'};
        $timeout(function(){
          $ctrl.ngRepeatsHeight = {
          // See setListHeight below
          height: (window.getComputedStyle(document.getElementById('theNgOutlet'),null).getPropertyValue("height"))	
          }}, 1);

      var tempData = $ctrl.dateCountryCombos;
      $ctrl.dateCountryCombos = [];
      $timeout(function(){
        $ctrl.dateCountryCombos = tempData;
        }, 1);
*/

      if(!$scope.$root.$$phase)
	$scope.$digest(); // JFT-TODO: wha?
      }

		  
    outbreakService.timeSeriesPromise.then(function(anOutbreak){
      var intervalsCount = Object.keys(anOutbreak.time_series.intervals.byID).length;
      console.log('time_series_table.js: got anOutbreak, # intervals = ' + intervalsCount);
      $ctrl.outbreak = anOutbreak;       
      console.log("indicators.length=" + Object.keys(anOutbreak.parsingReport.allParsedIndicatorsByName).length);
      $ctrl.indicatorNames = Object.keys(anOutbreak.parsingReport.allParsedIndicatorsByName);
      /* from when was using ng-repeat. Slow.
      $ctrl.intervalsCount = intervalsCount;
      $ctrl.intervals = anOutbreak.time_series.intervals.bySequence;
      $ctrl.intervalKeys = Object.keys(anOutbreak.time_series.intervals.byID);
      */

      /* Translate domain model (read: anOutbreak) into display model (read: food for Angular).
       * In this case the display is based an mdVirtualRepeat so need a flat array of rows, 
       * some of which are actually row-group headers (one per interval) which is indicated by isHeader == true
       */
      var intervalsFlattened = [];
      anOutbreak.time_series.intervals.byTime.forEach(function(anInterval){
	intervalsFlattened.push({intervalLabel: anInterval.id, isHeader: true});

        /* JFT-TODO: in the outbreak object model, on locations, there should be max values recorded for each indicator (over all intervals).
         * That is what should be the sort order of countries within a day, i.e. _.sortBy()
         * But for now, just sort by cum.deaths of current interval. 
	 * That is arguably sane, although order may change over time it is A logical answer and easier to implement, for now
         */		  
        // var sortedLocs = _.sortBy(anInterval.locations.bySequence, function(aLoc){return - $ctrl.outbreak.parsingReport.locations[aLoc.id].indicatorMaxs['death']});
          var sortedLocs = _.sortBy(anInterval.locations.bySequence, function(aLoc){return - (aLoc.indicators['otss_deaths_all'] ? aLoc.indicators['otss_deaths_all'] : 0)});
	//anInterval.locations.bySequence.forEach(function(aLoc){
	sortedLocs.forEach(function(aLoc){
	  intervalsFlattened.push({location: aLoc, isHeader: false});
	  });
        });
      setListHeight();	
      $ctrl.dateCountryCombos = intervalsFlattened;

      // In the UI, deaths and cases are juxtaposed as red and blue horizontal bar charts; they need to be scaled the same.	
      $ctrl.maxBarValue = Math.max(
	    $ctrl.outbreak.parsingReport.allParsedIndicatorsByName['otss_deaths_all'].maxValue,
	    $ctrl.outbreak.parsingReport.allParsedIndicatorsByName['otss_cases_all' ].maxValue
            );
      $window.addEventListener('resize', setListHeight);
      }, function(){$log.error( 'time_series_table.js: time series load error()ed' );});
  }
  ]});
})();

/* JFT-TODO:
$onDestroy() $onDestroy() is a hook that is called when its containing scope is destroyed. We can use this hook to release external resources, watches and event handlers.
  so this is when to unwatch resize event
 */
