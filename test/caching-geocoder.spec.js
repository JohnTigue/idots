/* global console, require, describe, context, before, beforeEach, after, afterEach, it */

/** caching-geocoder.js resolves location names to latitude & longitude coordinates,
  * uses a cache which can be prefilled from a local file. Much more detail to be
  * found in the comments in caching-geocoder.js.
  */
describe('caching-geocoder.spec.js', function(){  
  'use strict'; 

  var logger = require('utilios/logger')('cacherTester');
  logger.level('info');
  
  var must         = require('must');

  var sinon        = require('sinon');
  var PassThrough  = require('stream').PassThrough;
  var http         = require('http');
  
  // Actual SUT:
  var geocoder     = require('../src/geo-librarian/caching-geocoder');

  /** Using PassThrough to do test doubling for Nominatim.
    * Following the style of: 
    *   http://codeutopia.net/blog/2015/01/30/how-to-unit-test-nodejs-http-requests/
    * Because cannot just use sinon's simple utilities:
    *   sinon's fakeServer is not designed to work with node, it's a browser only
    *   thing (XHR-based i.e. it uses its FakeXMLHttpRequest). Maybe in its 2.0 but not now.
    *     https://github.com/cjohansen/Sinon.JS/issues/319
    *     http://stackoverflow.com/questions/26790942/how-to-call-a-fakeserver-in-sinon-js-node
    *       "Sinon is overriding the browser's XMLHttpRequest to create FakeXMLHttpRequest."
    * So, sinon can be used as test double library in node (as per main page's docs) 
    * but the fakeServer bit only works in the browers (weak!)
    *
    * JFT-TODO: sounds like nock is worth checking out: https://github.com/pgte/nock
    * One way or another, this rigmarole of stubNominatimServer for sinon.stub() and then later
    * tear down seems a bit repetitive. A mocked HTTP stack would be nice and centralized.
    */
  function stubNominatimServer(aCannedJsonObject){
    // JFT-TODO: this really doesn't know anything about Nominatim. Might 
    // want to rename and move this out into a generic test-double-utils.js 
    var aResponse = new PassThrough();
    aResponse.write(JSON.stringify(aCannedJsonObject));
    aResponse.end();
    var aRequest = new PassThrough();

    // JFT-TOD: right here nock does the same:
    //   https://github.com/pgte/nock#how-does-it-work
    sinon.stub(http, 'request');
    http.request.callsArgWith(1, aResponse).returns(aRequest);
    }


  context('when mocha loads up this file', function(){
    it('should load caching-geocoder via module system i.e. basic sanity check', function(){
      must(geocoder).exist();
      });
    });


  context.only('when asked to geocode Seattle', function(){
    var seattleResult = {};

    before(function(){
      var seattleStub = {
        wrong:   [{lat:'11.11',   lon:'22.22'}],
        correct: [{lat:'47.6097', lon:'-122.3331'}] 
        };
      stubNominatimServer(seattleStub.correct);
      return geocoder.locate('Seattle').then(function(locations){
        seattleResult.long = parseFloat(locations[0].lon);
        seattleResult.lat  = parseFloat(locations[0].lat);
        logger.debug("in Seattle's then() locs.length=" + locations.length  + " and locs[0].long=" + locations[0].lon + " aka ~" + seattleResult.long);
        });
      });

    it('should say Seattle ~ (47 N & 122 W)', function(){
      // Seattle ~== 47.6097 N, 122.3331 W
      must(seattleResult.long).between(-122.8, -121.8);
      must(seattleResult.lat).between(47.1, 48.1);
      });
  
    after(function(){
      http.request.restore();
      });
    });

  
  context('when asked to geocode a name with embedded spaces ("New York City")', function(){
    var nycStub = {
      wrong: [{lat:'11.11',   lon:'22.22'}],
      correct: [{lat:'40.7127', lon:'-74.0059'}] 
      };
    var nyc = {};

    before(function(){
      stubNominatimServer(nycStub.correct);
      return geocoder.locate("New York City").then(function(locations){
        nyc.long = parseFloat(locations[0].lon);
        nyc.lat  = parseFloat(locations[0].lat);
        logger.debug("in NYC's then() locs.length=" + locations.length  + " and locs[0].long=" + locations[0].lon + " aka ~" + nyc.long);
        });
      });

    it('should deal with the spaces and report NYC\'s location correctly enough', function(){
      // NYC === 40.7127 N, 74.0059 W
      must(nyc.long).between(-74.5, -73.5);
      must(nyc.lat).between(40.0, 41.0);
      });

    after(function(){
      http.request.restore();
      });
    });


  /** Currently this is redundant as doesn't really do anything different from the Seattle case above
    * It also is clearly from an earlier coding style of mine (notice how the Promise is not returned). C'est la vie.
    * Not really dead code so cannot hurt to keep it around but if rewriting happens then consider chucking it.
    */
  context('when asked to geocode Fes', function(){
    var fesStub = {
      wrong:   [{lat:'11.11', lon:'-22.22'},          {lat:'33.33', lon:'-44.44'}],
      correct: [{lat:'34.0341156', lon:'-5.0133482'}, {lat:'34.02813075', lon:'-5.01220890165468'}]
      };
    var fesLoc = {};

    before(function(){
      stubNominatimServer(fesStub.correct);
      var startTime = process.hrtime();

      return geocoder.locate('Fes, Morocco').then(function(locs){
        fesLoc.long = parseFloat(locs[0].lon);
        fesLoc.lat = parseFloat(locs[0].lat);
        logger.debug("in Fes's then() locs.length=" + locs.length  + " and locs[0].long=" + locs[0].lon + " aka ~" + fesLoc.long);
        var firstElapsedMillis = process.hrtime(startTime)[1] / 1000000;
        logger.debug("lookup of Fes took " + firstElapsedMillis + " milliseconds.");
        });
      });
 
    it('should respond with approx. correct coords for Fes', function(){
      // Fes, Morocco 34.0333 N, 5.0000 W
      must(fesLoc.long).between(-5.2, -4.8);
      must(fesLoc.lat).between(33.5, 34.5);
      });

    after(function(){
      http.request.restore();
      });
    });
  
  
  /** See test/tickle-osm-nominatim-geocoder-test.js for this same 
    * test (i.e. ask for Bangkok twice) done by actually hitting the 
    * network. I.e. this is isolated unit test, that is integration testing.
    */
  context('when asked to geocode the same name twice (Bangkok)', function(){
    function isBangkok(aLoc){
      //Bangkok, Thailand is at roughly 13.7563° N, 100.5018° E
      var aLat = parseFloat(aLoc.lat);
      var aLong = parseFloat(aLoc.lon);
      var answer =  (13.2 < aLat && aLat < 14.2) && (100.0 < aLong && aLong < 101.0); 
      logger.debug('isBangkok()==' + answer);
      return answer;
      }

    var bangkokFirstAsk = {};
    var bangkokSecondAsk = {};
    var cacheCounts = {};

    before(function(done){
      geocoder.resetCache(); 
      // ...just incase Bangkok got asked for in some earlier describe()

      cacheCounts.init = geocoder.getCacheSize();
      var bangkokStub = {
        wrong: [{lat:'11.11', lon:'22.22'}],
        correct: [{lat:'13.7563', lon:'100.5018'}]
        };
      stubNominatimServer(bangkokStub.correct);

      // Ask for Bangkok twice:
      // JFT-TODO: could do this as returning a new Promise.all([1st, 2nd]) 
      // ...or would that not ensure sequential behavior i.e. want to test
      // that first request loads the cache before second one runs. So, chain 
      // the two requests instead: then().then()
      geocoder.locate('Bangkok, Thailand').then(
        function(locations){
          cacheCounts.afterFirstAsk = geocoder.getCacheSize();
          bangkokFirstAsk.location = locations[0];
          logger.debug('in Bangkok then() #1');  
          // Ask a second time:
          // JFT-TODO: could make this a chained .then()
          geocoder.locate('Bangkok, Thailand').then(function(locs){
            cacheCounts.afterSecondAsk = geocoder.getCacheSize();
            bangkokSecondAsk.location = locations[0];
            done();}
            );
  	  } 
        );
      });

    it('should cache results rather than hit the network twice', function(){
      // Check that geocoder returned location of Bangkok twice,
      //   and more importantly the cache's size grew by one first time and by zero second time.
      must(isBangkok(bangkokFirstAsk.location)).true();
      must(cacheCounts.init + 1).equal(cacheCounts.afterFirstAsk);
      must(isBangkok(bangkokSecondAsk.location)).true();
      must(cacheCounts.afterFirstAsk).equal(cacheCounts.afterSecondAsk);
      });

    after(function(){
      http.request.restore();
      });
    });


  /** This geocoder is a caching geocoder. The cache consists of a
    * mapping of location names to Promises of corresponding
    * geo-coordinates. The cache can be populated 2 ways: 
    *
    * 1. The obvious way is for it to go fetch a name's
    *    geo-coordinates via a geocoding service's HTTP REST API.  
    *
    * 2. The less obvious way is for it to be fed pre-fetched mappings
    *    of loc-name-to-geo-coord.
    * 
    * The latter case is useful for situations where the location
    * names that will be of interest are known ahead of time. In that
    * caase, pre-loading the cache can make for a much quicker
    * start-up time compared to having to go across the network for
    * each location name's geo-coordinates.
    */

   /* JFT-TODO:
    *
    * Any reason to do the original plan of make insta-resolved
    * Promises here and hand them to cache-geocoder? Instead I ended
    * out just handing in (name, lat, long): In the interest of
    * separation of responsibilities, caching-geocoder.js does not
    * know where the pre-canned Promises come from; it is handed the
    * Promises and caches them. Something else is responsible for
    * coming up with the promises, say, by reading canned data from a
    * local file or other store.
    */
  context('when a name-to-geo-loc is set via pre-fetch', function(){
    var cacheCounts = {};
    var returnedLocs = null;

    before(function(){
      geocoder.setPrefetched('Meliandou, Guinea', 8.6226, -10.0642);
      cacheCounts.before = geocoder.getCacheSize();
      return geocoder.locate('Meliandou, Guinea').then(function(locations){
        returnedLocs = locations;
        cacheCounts.after = geocoder.getCacheSize();        
        });	
      });

    it('must, when later geocode that name, return a Promise with those coords and not hit the network', function(){
      must(cacheCounts.before).equal(cacheCounts.after);
      must(returnedLocs[0].lat).equal(8.6226);
      must(returnedLocs[0].lon).equal(-10.0642);
      });
    });
  });
