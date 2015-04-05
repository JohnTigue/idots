/* global console, require, describe, context, before, beforeEach, after, afterEach, it */

/** caching-geocoder.js resolves location names to lat&long, uses a cache which can be prefilled from a local file.
  */
describe('caching-geocoder-spec.js', function(){  
  'use strict'; 

  var bunyan         = require('bunyan');
  var logger         = bunyan.createLogger({name: 'myapp'});
  logger.level('info');
  
  var chai           = require('chai');
  var assert         = chai.assert;


  //JFT-TODO: want to kill expect off s.t. only using assert interface b/c insane asserting-on-property-access. 
  //  https://github.com/moll/js-must#asserting-on-property-access
  //  chai-as-promise is still being used though.
  var expect         = chai.expect;  
  
  // JFT-TOOD: not clear if chaiAsPromised is needed currently (2015-03) as recently mocha has promises built in.
  // 2015-03-31: this is currently being used though. Search for "eventually". 
  var chaiAsPromised = require('chai-as-promised');
  chai.use(chaiAsPromised);
  
  var sinon          = require('sinon');
  var PassThrough    = require('stream').PassThrough;
  var http           = require('http');
  
  // Actual SUT:
  var geocoder       = require('../src/geo-librarian/caching-geocoder');
  
  
  // JFT-TODO: this really doesn't know anything about Nominatim. Might want to rename and move this out into a generic test-double-utils.js 
  
  /** Using PassThrough to do test doubling for Nominatim.
    * Following the style of: 
    *   http://codeutopia.net/blog/2015/01/30/how-to-unit-test-nodejs-http-requests/
    * Because cannot just use sinon's simple utilities:
    *   sinon's fakeServer is not designed to work with node, it's a browser thing (XHR base). Maybe in 2.0 but not now.
    *     https://github.com/cjohansen/Sinon.JS/issues/319
    *     http://stackoverflow.com/questions/26790942/how-to-call-a-fakeserver-in-sinon-js-node
    *       "Sinon is overriding the browser's XMLHttpRequest to create FakeXMLHttpRequest."
    * So, sinon can be used as test double library in node (as per main page's docs) but the fakeServer bit only works in the browers (weak!)
    */
  function stubNominatimServer(aCannedJsonObject){
    var aResponse = new PassThrough();
    aResponse.write(JSON.stringify(aCannedJsonObject));
    aResponse.end();
    var aRequest = new PassThrough();
    sinon.stub(http, 'request');
    http.request.callsArgWith(1, aResponse).returns(aRequest);
    }
  

  context('when test runner inits this file', function(){
    it('should load caching-geocoder via module system i.e. basic sanity check', function(){
      assert.isDefined(geocoder);
      });
    });


  context('when asked to geocode Seattle', function(){
    var seattleResult = {};

    before(function(done){
      var seattleStub = {
        wrong: [{lat:'11.11', lon:'22.22'}],
        right: [{lat:'47.6097', lon:'-122.3331'}] 
        };
      stubNominatimServer(seattleStub.right);
      geocoder.locate('Seattle').then(function(locations){
        seattleResult.long = parseFloat(locations[0].lon);
        seattleResult.lat  = parseFloat(locations[0].lat);
        logger.debug("in Seattle's then() locs.length=" + locations.length  + " and locs[0].long=" + locations[0].lon + " aka ~" + seattleResult.long);
        done();
        }, function(err){done(err);}
        );
      });

    it('should say Seattle ~ (47°N & 122°W)', function(){
      // Seattle === 47.6097° N, 122.3331° W
      assert.closeTo(seattleResult.long, -122.3, 0.5, "Seattle is close to 122.3° W"); 
      assert.closeTo(seattleResult.lat, 47.6, 0.5, "Seattle is close to 47.6° N"); 
      });

    it.skip('should say Seattle ~= 47 degrees North (chai as promised)', function(done) {
      var seattleLatPromise = geocoder.locate('Seattle');
      seattleLatPromise.then( function(locs) {
        var seaLat = parseInt(locs[0].lat);
        logger.debug( 'in SEA test\'s then() locs.length=' + locs.length  + ' and locs[0].lat=' + locs[0].lat + ' aka ~' + seaLat );
        return seaLat;
        });
      logger.debug('seattleLatPromise='+seattleLatPromise);
      assert.isDefined(seattleLatPromise);
  
      // JFT-TODO: something wrong here: (with chai-as-promised?)
      // TypeError: Cannot read property 'eventually' of undefined
      return seattleLatPromise.should.eventually.equal(47); //'Seattle is ~47 North'
      });
  
    after(function(){
      http.request.restore();
      });
    });

  
  context('when asked to geocode a name with embedded spaces "New York City"', function(){
    var nycStub = {
      wrong: [{lat:'11.11', lon:'22.22'}],
      right: [{lat:'40.7127', lon:'-74.0059'}] 
      };
    var nyc = {};

    before(function(done){
      stubNominatimServer(nycStub.right);
      geocoder.locate( "New York City" ).then( function(locations) {
        nyc.long = parseFloat(locations[0].lon);
        nyc.lat  = parseFloat(locations[0].lat);
        logger.debug("in NYC's then() locs.length=" + locations.length  + " and locs[0].long=" + locations[0].lon + " aka ~" + nyc.long);
        done();
        }, function(err){done(err);}
        );
      });

    it('should deal with the spaces and report NYC\'s location correctly enough', function(){
       // NYC === 40.7127° N, 74.0059° W
      assert.closeTo(nyc.long, -74, 0.5, "NYC is close to 74° W"); 
      assert.closeTo(nyc.lat, 40.5, 0.5, "NYC is close to 41° N"); 
      });

    after(function(){
      http.request.restore();
      });
    });


  context('when asked to geocode Fes', function(){
    var accurateNominatimAnswerForFes  = [{lat:'34.0341156', lon:'-5.0133482'}, {lat:'34.02813075', lon:'-5.01220890165468'}];
    var inaccurateNominatimAnswerForFes = [{lat:'11.11', lon:'-22.22'}, {lat:'33.33', lon:'-44.44'}];
    var fesLong = 0;
    var fesLat = 0;

    before(function(done){
      stubNominatimServer(accurateNominatimAnswerForFes);

      var startTime = process.hrtime();
      geocoder.locate('Fes, Morocco').then( function( locs ) {
        fesLong = parseFloat(locs[0].lon);
        fesLat = parseFloat(locs[0].lat);
        logger.debug( "in Fes's then() locs.length=" + locs.length  + " and locs[0].long=" + locs[0].lon + " aka ~" + fesLong );
        var firstElapsedMillis = process.hrtime( startTime )[1] / 1000000;
        logger.debug( "lookup of Fes took " + firstElapsedMillis + " milliseconds." );
        done();
        }, function(err) {done(err);}
        );
      });
 
    it('should respond with approx. correct coords for Fes', function(){
      // Fes, Morocco 34.0333° N, 5.0000° W
      assert.closeTo(fesLong, -5, 0.1, "Fes is very close to 5.0° W"); 
      assert.closeTo(fesLat, 34, 0.1, "Fes is very close to 34.0° N"); 
      });

    after(function(){
      http.request.restore();
      });
    });
  
  
  // see test/test/tickle-osm-nominatim-geocoder-test.js for the same test (i.e. ask for Bangkok twice) done by actually hitting the network.
  context('when asked to geocode the same name twice (Bangkok)', function(){
    function isBangkok(aLoc){
      //Bangkok, Thailand is at roughly 13.7563° N, 100.5018° E
      var aLat = parseFloat(aLoc.lat);
      var aLong = parseFloat(aLoc.lon);
      var answer =  (13.2 < aLat && aLat < 14.2) && (100.0 < aLong && aLong < 101.0); 
      logger.debug("isBangkok()==" + answer);
      return answer;
      }

    var bangkokFirstAsk = {};
    var bangkokSecondAsk = {};
    var cacheCounts = {};

    before(function(done){
      geocoder.clearCache(); // just incase Bangkok got asked for in some other describe()
      cacheCounts.init = geocoder.getCacheSize();
      var bangkokStub = {
        wrong: [{lat:'11.11', lon:'22.22'}],
        correct: [{lat:'13.7563', lon:'100.5018'}]
        };
      stubNominatimServer(bangkokStub.correct);

      // Ask for Bangkok twice:
      geocoder.locate('Bangkok, Thailand').then(
        function(locations){
          cacheCounts.afterFirstAsk = geocoder.getCacheSize();
          bangkokFirstAsk.location = locations[0];
          logger.debug("in Bangkok then() #1");  
          // Ask a second time:
          geocoder.locate('Bangkok, Thailand').then(function(locs){
            cacheCounts.afterSecondAsk = geocoder.getCacheSize();
            bangkokSecondAsk.location = locations[0];
            done();}, 
            function(err) {done(err);}
            );
  	  }, 
        function(err) {done(err);} // JFT-TODO: can this be reduced to just: done
        );
      });

    it('should cache results rather than hit the network twice', function(){ 
      // Check that geocoder returned location of Bangkok twice, 
      //   and more importantly the cache's size grew by one first time and by zero second time.
      assert(isBangkok(bangkokFirstAsk.location), "first Bangkok ask got wrong result");
      assert(cacheCounts.init + 1 === cacheCounts.afterFirstAsk, "first Bangkok ask did not increase cache size");
      assert(isBangkok(bangkokSecondAsk.location), "second Bangkok ask got wrong result");
      assert(cacheCounts.afterFirstAsk === cacheCounts.afterSecondAsk, "second Bangkok ask did increase cache size");
      });

    after(function(){
      http.request.restore();
      });
    });
  });
