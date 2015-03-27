'use strict';

var bunyan = require( 'bunyan' );
var logger = bunyan.createLogger( {name: 'myapp'} );
logger.level( 'debug' );

var expect = require('chai').expect;
var http   = require( 'http' );

// JFT-TODO: Ugh, the two are conflated and should be factored out to separate files
var cacher   = require( '../src/utils/construct_preload_cache_of_locations.js' );
var geocoder = require( '../src/geo_librarian/caching_geocoder' );


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
