(function(){
'use strict';

angular.module('omolumeter.epicurves', [])
.component('epicurves', {
  templateUrl: 'components/epicurves/epicurves.html',
  $routerCanReuse: function(){return false},
  controller: ['outbreakService', 'geopoliticService', '$mdToast', '$element', '$log', function (outbreakService, geopoliticService, $mdToast, $element, $log) {  
    'use strict';
    var $ctrl = this;
 
    $ctrl.locationColumnDefs = [
      {"id":"GIN", "type":"line", "name":"Guinea",       "color":"#A00000" }, 
      {"id":"LBR", "type":"line", "name":"Liberia",      "color":"#000099"   },
      {"id":"SLE", "type":"line", "name":"Sierra Leone", "color":"green"  }
      //{"id":"MLI", "type":"line", "name":"Mali",         "color":"rgba(245, 61, 187, 1)" }
      ];

    $ctrl.timeSeriesData = [];

    $ctrl.formatYTick = function(aTick){
      return parseInt(aTick) / 1000 + "K";
      };

    $ctrl.onChartInstantiated = function(aChart){
      $ctrl.chart = aChart;
      console.log('==================================');	
      var parentsHeight = (window.getComputedStyle(document.getElementById('chartParent'),null).getPropertyValue("height"));
	parentsHeight = parentsHeight.slice(0, -2);// get rid of "px"
      console.log("epicurves $onInit(): parent's height " + parentsHeight );
      $ctrl.chart.resize({height: parentsHeight});
      };
      
    $ctrl.$onInit = function(){
      // https://github.com/brandonroberts/angularjs-component-router/issues/12#issuecomment-209426060
      $element.addClass('flex layout-column');
      };
      
    $ctrl.formatXTick = function(aTick){
      //console.log(aTick);
      //var options = {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'};//aTick.getMonth() + ' ' + aTick.getDay();
      //return aTick.toDateString('en-US', options).slice(3);
      var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
      return monthNames[aTick.getMonth()] + " '" + String.prototype.slice.call(aTick.getFullYear(), 2);
      }
      
    outbreakService.timeSeriesPromise.then(function(anOutbreak){
      var intervalsCount = Object.keys(anOutbreak.time_series.intervals.byID).length;
      console.log('epicurves.js: got anOutbreak, # intervals = ' + intervalsCount);
      $ctrl.outbreak = anOutbreak;       
      console.log("indicators.length=" + Object.keys(anOutbreak.parsingReport.allParsedIndicatorsByName).length);
      $ctrl.indicatorNames = Object.keys(anOutbreak.parsingReport.allParsedIndicatorsByName);

      var timeSeriesDataForC3 = [];
      anOutbreak.time_series.intervals.bySequence.forEach(function(anInterval){
        var aNewIntervalForC3 =  {"x": new Date(anInterval.id) };            
	//console.log(anInterval.id + ', ' + new Date(anInterval.id));
        timeSeriesDataForC3.push(aNewIntervalForC3);
          anInterval.locations.bySequence.forEach(function(aLoc){
            aNewIntervalForC3[aLoc.location.iso3Code] = aLoc.indicators['otss_deaths_all'];//otss_deaths_all']
            });
        });
      $ctrl.timeSeriesData = timeSeriesDataForC3;
      });
    }]});
}());
          
