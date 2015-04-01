'use strict';

/** Very basic sanity check of node being able to communicate with Open Street Map's Nominatium geocoder.
  * Nominatim is given names, say, "Seattle" and it returns a array of possible matches.
  * The multiplicity of answers results from multiple entries being in Nominatum.
  * The answers are usually right but may vary a wee bit in lat and long.
  */

var bunyan   = require( 'bunyan' );
var logger   = bunyan.createLogger( {name: 'myapp'} );
logger.level('info');

var expect   = require('chai').expect;
var geocoder = require('../src/geo-librarian/caching-geocoder');

/** JFT-TODO: kick this around with some other modules, say, request and superagent maybe superfetch
  *   request:
  *     https://www.npmjs.com/package/request 
  *   superagent:
  *     At the SeattleJS meetup at Facebook on [2015-03-04 Wed] the guy said he really liked itb
  *     http://visionmedia.github.io/superagent/
  *     http://dailyjs.com/2011/08/08/code-review/
  *   superfetch:
  *     http://dailyjs.com/2015/03/19/anicollection-superfetch/
  */
var http   = require('http');

// JFT-TODO: these are integration tests (kinda) and as such are really hitting the net ergo slowing testing down. Each test is about .5 second. Too slow.
describe( 'tickle-osm-nominatim-geocoder-test.js [\"integration test\" so slow is OK]', function(){
  describe( 'when OSM\'s Nominatim geocoder reachable on net' , function() {
    var someRequestOpts = {
          hostname: 'nominatim.openstreetmap.org',
          port: 80,
          method: 'GET',      
          path: '/search/?q=Seattle&limit=5&format=json&addressdetails=1'
          };

    // JFT-TODO: this works. Skipping it b/c it's really a (slow) integration test, not a unit test  
    it.skip( 'should 200 for Seattle (not looking at Response body)', function(done) {
      var aRequest = http.request( someRequestOpts, function( aResponse ) {
            logger.debug( 'Status code=' + aResponse.statusCode );
            expect(aResponse.statusCode, 'Status code').to.equal(200);
  	  done();
            });
  
      logger.trace(aRequest);
      aRequest.on('error', done);
      aRequest.end();
      });


    // JFT-TODO: this works. Skipping it b/c it's really a (slow) integration test, not a unit test  
    it.skip( "should say Seattle's lat ~= 47 (not cached)", function(done) {
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
              logger.trace( JSON.stringify( bodAsJson, null, "  " ) );
              expect(seattleLatInt, "Seattle's lat(i.e. 47)").to.equal( 47 );
  	    done();
              }
            ); 
          }
        ).on( 'error', done );
      aReq.end();
      });
    });

  /** Thi was originally part of caching-geocoder-spec.js back before that actually became _isolated_ unit test.
    * In other words, although this does nicely test the _caching_ feature of the geocoder, it does so by actually
    * going out across the network once, ergo not _isolated_ and as such slow (~.5 to 1.5s).
    * The testing here is based on the timing only, rather than inspecting the state of the cache.
    * The idea being that the first request should take "long," roughly at least a few 100 milliseconds.
    * The second request should only hit the cache, not the network, and a such should be fast, < 1 millisecond.
    */
  // worked when decided to skip it b/c it's in test/ ergo mocha was running it as unit test and it is desired that those be fast as possible.
  // JFT-TODO: re-enable when this file is moved out of integration test and over to (currently non-existant) integration test.
  describe.skip('when asked to geocode the same name twice (Bangkok)', function(){
    //Bangkok, Thailand is at 13.7563° N, 100.5018° E
    function isBangkok( aLoc ) {
      var answer = (parseInt(aLoc.lon) === 100) && (parseInt(aLoc.lat) === 13); 
      logger.debug( "isBangkok()==" + answer );
      return answer;
      }

    it('should cache results rather than hit the network twice', function(done){
      var startTime = process.hrtime();
      expect(true).true; // see next comment for explanation for this
      geocoder.locate("Bangkok, Thailand").then( function(locs){
        logger.debug("in Bangkok then() #1");
        // JFT-TODO: this is odd debugging. if expect(false).true inside a then() will cause timeout to be reported but same outside of then() gives AssertionError.
        //   Perhaps this has to do with needing mocha-as-promised and/or chai-as-promised
        // expect(true).true; 
        expect(isBangkok(locs[0])).true;
	var firstElapsedMillis = process.hrtime(startTime)[1] / 1000000;
	logger.debug( "Fist lookup of Bangkok took " + firstElapsedMillis + " milliseconds." );

	// Ask a second time:
        var secondStartTime = process.hrtime();
        geocoder.locate("Bangkok, Thailand").then(function(locs){
  	  var secondElapsedMillis = process.hrtime( secondStartTime )[1] / 1000000;
          logger.debug( "Second lookup of Bangkok took " + secondElapsedMillis + " milliseconds." );
	  expect(isBangkok(locs[0])).true;
  	  expect(secondElapsedMillis < 2).to.be.ok; // Cache responded quickly
          done();}, function(err) {done(err);});
	}, function(err) {done(err);} // JFT-TODO: can this be reduced to just: done
        );
      });
    });
  });  

