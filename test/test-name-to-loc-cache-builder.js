'use strict';

var bunyan = require( 'bunyan' );
var logger = bunyan.createLogger( {name: 'myapp'} );
logger.level( 'debug' );

/** Backgrounders on tape for testing:
  *   https://ci.testling.com/guide/tape
  *   http://substack.net/how_I_write_tests_for_node_and_the_browser
  */
var test = require( 'tape' );

var http = require( 'http' );

// JFT-TODO: Ugh, the two are conflated and should be factored out to separate files
var cacher   = require( '../src/utils/construct_preload_cache_of_locations.js' );
var geocoder = require( '../src/geo_librarian/caching_geocoder' );


test( 'module load sanity check', function( t ) {
    t.plan( 1 );
    t.ok( test, 'tape module loaded ok' );
    }
  );


test( 'check testee loads', function( t ) {
    t.plan( 1 );
    t.ok( cacher, 'cacher module loaded ok' );
    }
  );


test( 'See if Nominatim will 200 for Seattle (not looking at Response body)', function( t ) {
    t.plan( 1 );

    var someRequestOpts = {
      hostname: 'nominatim.openstreetmap.org',
      port: 80,
      method: 'GET',  
      path: '/search/?q=Seattle&limit=5&format=json&addressdetails=1'
      };

    var aRequest = http.request( someRequestOpts, function( aResponse ) {
        logger.debug( 'STATUS: ' + aResponse.statusCode );
        t.ok( aResponse.statusCode, 200, 'Status code is 200' );
        }
      );

    logger.trace( aRequest );

    aRequest.on( 'error', function( anError ) {
        logger.warn( 'aRequest errored' + anError.message );
        }
      );

    aRequest.end();
    }
  );


test( 'Old-school callback lookup for Seattle via Nominatim', function( t ) {
    t.plan( 1 );

    var someRequestOpts = {
      hostname: 'nominatim.openstreetmap.org',
      port: 80,
      method: 'GET',  
      path: '/search/?q=Seattle&limit=5&format=json&addressdetails=1'
      };

    var aReq = http.request( someRequestOpts, function( response ) {
        logger.debug( 'http.request has a response object' );
        var respBod = '';
        response.on( 'data', function( aChunk ) {
            logger.debug( 'http.request got aChunk:' ); //+ aChunk )
            respBod += aChunk;
            }
          );
        response.on( 'end', function() {
            var bodAsJson = JSON.parse( respBod );
            var seattleLatInt = parseInt(bodAsJson[0].lat);
            logger.debug( 'repsonse ended. Seattle Lat=' + seattleLatInt );
            t.equal( 47, seattleLatInt, "Seattle's lat === 47" );
            logger.trace( JSON.stringify( bodAsJson, null, "  " ) );
            }
          ); 
        }
      ).on( 'error', function( anErr ) { logger.error( anErr ); } );
    aReq.end();
    }
  );


// JFT-TODO: do that with http request instead, as it has a simpler and more consistent API


/** Enough with raw APIs, now for using my caching geocoder which returns Promises
  */

test( 'check for caching_geocoder module to load', function( t ) {
    t.plan( 1 );
    t.ok( geocoder, 'geocacher module loaded ok' );
    }
  );


test( 'See if caching geocoder will find Seattle', function( t ) {
    t.plan( 1 );
    geocoder.locate( "Seattle" ).then( function( locs ) {
      var seaLat = parseInt( locs[0].lat );
      logger.debug( "in SEA test's then() locs.length=" + locs.length  + " and locs[0].lat=" + locs[0].lat + " aka ~" + seaLat );
      t.equal( seaLat, 47, 'Seattle is ~47 North' );
      } );
    }  
  );


test( 'Check that url encoding is happening on names (containing spaces i.e New York City)', function( t ) {
    t.plan( 1 );
    geocoder.locate( "New York City" ).then( function( locs ) {
      var nycLong = parseInt( locs[0].lon );
      logger.debug( "in NYC's then() locs.length=" + locs.length  + " and locs[0].long=" + locs[0].lon + " aka ~" + nycLong );
      t.equal( nycLong, -73, 'NYC is circa 73 degrees west of the prime meridian' );
      } );
    }
  );

/**
  * JFT-TODO: 
  * Also, rather than just time response perhaps should inspect state of cache (consider if network were test doubled): 
  *   so verify it having the same number of cached object before and after second call.
  * Also this is coupled to previous tests. This single test should call into cache twice for same loc name, say, "Leibzig"
  */
test( 'Check that cache is working', function( t ) {
    t.plan( 2 );
 
    var startTime = process.hrtime();

    geocoder.locate( "New York City" ).then( function( locs ) {
      var nycLong = parseInt( locs[0].lon );
      logger.debug( "in NYC's then() locs.length=" + locs.length  + " and locs[0].long=" + locs[0].lon + " aka ~" + nycLong );
      t.equal( nycLong, -73, 'NYC is circa 73 degrees west of the prime meridian' );
      var elapsedMillis = process.hrtime( startTime )[1] / 1000000;
      logger.debug( "repeat lookup of NYC (so, cached) took " + elapsedMillis + " milliseconds." );
      t.ok( elapsedMillis < 2, "Cache responded quickly" );
      } );
    }
  );
