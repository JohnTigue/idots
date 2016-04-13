(function(){
'use strict';

var omolumeterApp = angular.module('omolumeterApp'); 
  
/*******************  OutbreakTimeSeriesService.js ****************************/
/* outbreakService is an Angular data service. App accesses an OTSS data model through APIs.
 * outbreakService will fetch and parse Resources as needed and cache instantiated objects of data model.
 */


// Config constants:
// JFT-TODO: this could be an angular.value() or angular.constant() and defined in main.js?

// OTSS data file
// File originally from HDX. CSV headers are: Indicator,Country,Date,value
// 17K rows: ebola_data_db_format.2016_03_20.csv
var timeSeriesDataDocUrl = '../../../test/data/ebola_2014/ebola_data_db_format.2016_03_20.csv';
//  1K rows: ebola_data_db_format.1000_rows.csv
//var timeSeriesDataDocUrl = '../../../test/data/ebola_2014/ebola_data_db_format.1000_rows.csv';

// WHO Sit Rep data file  
var whoSituationReportDataDocUrl = '../../../test/data/ebola_2014/who_sit_rep.2016_03.json';
//var whoSituationReportDataDocUrl = 'http://apps.who.int/gho/athena/xmart/EBOLA_MEASURE/CASES,DEATHS.json?filter=COUNTRY:*;LOCATION:-;DATAPACKAGEID:2016-03-30;INDICATOR_TYPE:SITREP_CUMULATIVE;INDICATOR_TYPE:SITREP_CUMULATIVE_21_DAYS';


omolumeterApp.factory('outbreakService', ['dsv', '$http', '$log', function(dsv, $http, $log){
  // Set up timeSeries
  var timeSeries = {};
  timeSeries.promise = null;
  timeSeries.dataUrl = "";
  var loadTimeSeries = function(anOtssDocUrl){
    timeSeries.dataUrl = anOtssDocUrl;

    /*
    var aPromise = dsv.csv({method: 'GET', url: anOtssDocUrl, timeout:60000}, function(d) {
      return { indicator: d.Indicator, country: d.Country, date: new Date(d.Date), value: parseInt(d.value) };
    })
    aPromise.success(function(data, status, headers, config) {
      $log.log('outbreakService(): success (' + data.length + ' rows).');
    })
    .error(function(data, status, headers, config) {
      $log.error( 'outbreakService(): error):' + status + headers + config + data );
    });
    return aPromise;
    */
    $log.log( 'timeSeries.dataUrl=' + timeSeries.dataUrl);
    return $http({method: 'GET', url: timeSeries.dataUrl}).then(function(response){
      $log.log( 'outbreakService.loadTimeSeries() then(): response.status=' + response.status);
      return dsv.csv.parse(response.data, function(d) {
	//console.log('parsing');
        return { indicator: d.Indicator, country: d.Country, date: new Date(d.Date), value: parseInt(d.value) };
        });
      }).then(function(parsedRows){
        console.log('parsedRows[0].country='+parsedRows[0].country);
	return parsedRows;
        });
    

      // JFT-TODO: dead. kill
      //return $http.get(timeSeriesDataDocUrl).then(function(response){
      //  return response.data;
      //  })
  }			      
  timeSeries.promise = loadTimeSeries(timeSeriesDataDocUrl);

  
  // Set up whoSituationReport, the WHO's sit-rep data in JSON 
  var whoSituationReport = {}
  whoSituationReport.promise = null;
  whoSituationReport.datUrl = null;
  var loadWhoSitRep = function(aSitRepUrl){
    whoSituationReport.dataUrl = aSitRepUrl;
    $log.log( 'whoSituationReport.dataUrl=' + whoSituationReport.dataUrl);
    return $http({method: 'GET', url: whoSituationReport.dataUrl}).then(function(response){
      $log.log( 'loadWhoSitRep() called back: copyright=' + response.data.copyright);
      return response;
      });
    }			      
  whoSituationReport.promise = loadWhoSitRep(whoSituationReportDataDocUrl);
    
  return {
    timeSeriesDataUrl: timeSeries.dataUrl,
    timeSeriesPromise: timeSeries.promise,
    whoSituationReportPromise: whoSituationReport.promise 
    };
  }]);

  
// end IFFE
}());  
