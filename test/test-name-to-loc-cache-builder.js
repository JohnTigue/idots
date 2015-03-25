'use strict';

var bunyan   = require( 'bunyan' );
var logger   = bunyan.createLogger( {name: 'myapp'} );
logger.level( 'info' );


/** Backgrounders on tape for testing:
  *   https://ci.testling.com/guide/tape
  *   http://substack.net/how_I_write_tests_for_node_and_the_browser
  */
var test     = require( 'tape' );

var http     = require( 'http' );
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


// JFT-TODO: do that with http request instead, as it has a simpler and more consistent API. Might as well derp around with fetch() as well, and that cancelable proxied fetch()


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
  * JFT-TODO: How to test this besides just looking at the log messages? which is all I'm currently doing.
  *   How about a timer? i.e this should take only a very few milliseconds
  */
test( 'Check that cache is working', function( t ) {
    t.plan( 1 );
    geocoder.locate( "New York City" ).then( function( locs ) {
      var nycLong = parseInt( locs[0].lon );
      logger.debug( "in NYC's then() locs.length=" + locs.length  + " and locs[0].long=" + locs[0].lon + " aka ~" + nycLong );
      t.equal( nycLong, -73, 'NYC is circa 73 degrees west of the prime meridian' );
      } );
    }
  );

