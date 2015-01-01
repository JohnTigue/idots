// Hat tip to https://github.com/sevcsik for notes on how to boot in node and angular:
//  https://gist.github.com/sevcsik/9207267

OTSR = new function() {};

OTSR.contextIsAngular = function()
  {
  return typeof angular !== 'undefined';
  }

OTSR.contextIsNode = function()
  {
  return typeof module !== 'undefined' && module.exports;
  }

OTSR.initializeToFramework = function()
  {
  var OutbreakTimeSeriesReaderModule = function()
    {
    var OutbreakTimeSeriesReader = function()
      {
      }
    return OutbreakTimeSeriesReader;
    }
  if( OTSR.contextIsAngular() )
    angular.module( 'app.outbreak_time_series_reader', [] ).
      factory( 'OutbreakTimeSeriesReader', [OutbreakTimeSeriesReaderModule] );
  else if( OTSR.contextIsNode() )
    module.exports = OutbreakTimeSeriesReaderModule();
  }
OTSR.initializeToFramework();
