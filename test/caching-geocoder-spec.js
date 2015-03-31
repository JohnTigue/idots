//"use strict";

/** caching-geocoder resolves location names to lat&long, uses a cache which can be prefilled from a local file.
  */

var bunyan         = require('bunyan');
var logger         = bunyan.createLogger({name: 'myapp'});
logger.level('info');

var chai           = require('chai');
var chaiAsPromised = require('chai-as-promised');
var expect         = require('chai').expect;
chai.use(chaiAsPromised);

var sinon          = require('sinon');
var PassThrough    = require('stream').PassThrough;
var http           = require('http');

var geocoder       = require( '../src/geo-librarian/caching-geocoder' );

function stubNominatimServer(aCannedJsonObject){
  //"use strict";
  var aResponse = new PassThrough();
  aResponse.write(JSON.stringify(aCannedJsonObject));
  aResponse.end();
  var aRequest = new PassThrough();
  sinon.stub(http, 'request');
  http.request.callsArgWith(1, aResponse).returns(aRequest);
  }


describe('spec caching-geocoder', function(){
  describe('when test runner inits this file (sanity check:)', function(){
    it('should load caching-geocoder via module system', function(){
      expect(geocoder).to.not.be.an('undefined');
      });
    });

  describe('when asked to geocode Seattle', function(){
    it.skip('should say Seattle ~= 47 degrees North (chai as promised)', function(done) {
      var seattleLatPromise = geocoder.locate('Seattle');
      seattleLatPromise.then( function(locs) {
        var seaLat = parseInt(locs[0].lat);
        logger.debug( 'in SEA test\'s then() locs.length=' + locs.length  + ' and locs[0].lat=' + locs[0].lat + ' aka ~' + seaLat );
        return seaLat;
        });
      logger.debug('seattleLatPromise='+seattleLatPromise);
      expect(seattleLatPromise).not.be.an('undefined');
  
      // JFT-TODO: something wrong here:
      // TypeError: Cannot read property 'eventually' of undefined
      return seattleLatPromise.should.eventually.equal(47); //'Seattle is ~47 North'
      });
  
    it('should say Seattle ~= 47 degrees North', function(done) {
      var seattleLatPromise = geocoder.locate('Seattle');
      seattleLatPromise.then( function(locs) {
        var seaLat = parseInt(locs[0].lat);
        logger.debug( 'in SEA test\'s then() locs.length=' + locs.length  + ' and locs[0].lat=' + locs[0].lat + ' aka ~' + seaLat );
        expect(seattleLatPromise).to.eventually.equal(47);
        done();
        }, function(err) {done(err);}
        );
      });
    });
  
  describe('when asked to geocode a name with embedded spaces "New York City"', function(){
    it('should deal with that and say NYC is ~=73 degrees West', function(done) {
      geocoder.locate( "New York City" ).then( function( locs ) {
        var nycLong = parseInt( locs[0].lon );
        logger.debug( "in NYC's then() locs.length=" + locs.length  + " and locs[0].long=" + locs[0].lon + " aka ~" + nycLong );
        expect(nycLong).to.equal(-73); //'NYC is circa 73 degrees west of the prime meridian' );
        done();
        }, function(err) {done(err);}
        );
      });
    });


  describe('when asked to geocode Fes', function(){
    var accurateNominatimAnswerForFes  = [{lat:'34.0341156', lon:'-5.0133482'}, {lat:'34.02813075', lon:'-5.01220890165468'}];
    var inaccurateNominatimAnswerForFes = [{lat:'11.11', lon:'-22.22'}, {lat:'33.33', lon:'-44.44'}];
    var fesLong = 0;
    var fesLat = 0;


    /** Using PassThrough to do test doubling for Nominatim.
      * Following the style of: 
      *   http://codeutopia.net/blog/2015/01/30/how-to-unit-test-nodejs-http-requests/
      * Because cannot just use sinon's simple utilities:
      *   sinon's fakeServer is not designed to work with node. Maybe in 2.0 but not now.
      *     https://github.com/cjohansen/Sinon.JS/issues/319
      *     http://stackoverflow.com/questions/26790942/how-to-call-a-fakeserver-in-sinon-js-node
      *       "Sinon is overriding the browser's XMLHttpRequest to create FakeXMLHttpRequest."
      * So, sinon can be used as test double library in node (as per main page's docs) but the fakeServer bit only works in the browers
      */
    before(function(done){
      /*
      var aResponse = new PassThrough();
      aResponse.write(JSON.stringify(trueFakeNominatimAnswerForFes));
      aResponse.end();
      var aRequest = new PassThrough();
      sinon.stub(http, 'request');
      http.request.callsArgWith(1, aResponse).returns(aRequest);
      */
      stubNominatimServer(accurateNominatimAnswerForFes);

      var startTime = process.hrtime();
      geocoder.locate('Fes, Morocco').then( function( locs ) {
        fesLong = locs[0].lon;
        fesLat = locs[0].lat;
        logger.debug( "in Fes's then() locs.length=" + locs.length  + " and locs[0].long=" + locs[0].lon + " aka ~" + fesLong );
        var firstElapsedMillis = process.hrtime( startTime )[1] / 1000000;
        logger.debug( "lookup of Fes took " + firstElapsedMillis + " milliseconds." );
        done();
        }, function(err) {done(err);}
        );
      });
 
    it('should respond with approx. correct coords for Fes', function(){
      // Fes, Morocco 34.0333° N, 5.0000° W
      expect(parseInt(fesLong)).to.equal(-5); // rounding down b/c real number can vary a bit.
      expect(parseInt(fesLat)).to.equal(34);  // ibid
      });

    after(function(){
      http.request.restore();
      });
    });
  
  
    /** JFT-TODO: 
      *   Rather than just time response to confirm cache is keeping and finding previously fetched info perhaps should inspect state of cache.
      *     Consider if the network were test doubled (which is desirable for FAST unit tests) instead of really hitting the network: 
      *       then no 2 milli delay would ever occur.
      *     So, instead, verify it having the same number of cached object before and after second call.
      */
  describe('when asked to geocode the same name twice', function(){
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
