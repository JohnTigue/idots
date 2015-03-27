'use strict';

/** caching-geocoder resolves location names to lat&long, uses a cache which can be prefilled from a local file.
  */

var bunyan         = require('bunyan');
var logger         = bunyan.createLogger({name: 'myapp'});
logger.level('info');

var chai           = require('chai');
var chaiAsPromised = require('chai-as-promised');
var expect         = require('chai').expect;
chai.use(chaiAsPromised);

var geocoder       = require( '../src/geo-librarian/caching-geocoder' );

describe('caching-geocoder', function() {
  it('should be loaded by module system', function() {
    expect(geocoder).to.not.be.an('undefined');
    });

  it.skip('should fetch geocode for Seattle', function(done) {
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

  it('should fetch geocode for Seattle', function(done) {
    var seattleLatPromise = geocoder.locate('Seattle');
    seattleLatPromise.then( function(locs) {
      var seaLat = parseInt(locs[0].lat);
      logger.debug( 'in SEA test\'s then() locs.length=' + locs.length  + ' and locs[0].lat=' + locs[0].lat + ' aka ~' + seaLat );
      expect(seattleLatPromise).to.eventually.equal(47);
      done();
      }, function(err) {done(err);}
      );
    });

  it('should fetch geocode for "New York City" i.e. hasSpaces()', function(done) {
    geocoder.locate( "New York City" ).then( function( locs ) {
      var nycLong = parseInt( locs[0].lon );
      logger.debug( "in NYC's then() locs.length=" + locs.length  + " and locs[0].long=" + locs[0].lon + " aka ~" + nycLong );
      expect(nycLong).to.equal(-73); //'NYC is circa 73 degrees west of the prime meridian' );
      done();
      }, function(err) {done(err);}
      );
    }
  );




  /**
    * JFT-TODO: 
    * Rather than just time response to confirm cache is keeping and finding previously fetched info perhaps should inspect state of cache.
    *   Consider if network were test doubled, instead of really hitting the network: then no 2 milli would ever occur.
    *   So verify it having the same number of cached object before and after second call.
    * Also this is coupled to previous tests. Instead, this single test should call into cache twice for same loc not-yet-fectched name, say, "Leibzig"
    */
  it('should cache results rather than hit the network twice', function(done){
    var startTime = process.hrtime();
    geocoder.locate( "New York City" ).then( function( locs ) {
      var nycLong = parseInt( locs[0].lon );
      logger.debug( "in NYC's then() locs.length=" + locs.length  + " and locs[0].long=" + locs[0].lon + " aka ~" + nycLong );
      expect(nycLong).to.equal(-73); // 'NYC is circa 73 degrees west of the prime meridian'
      var elapsedMillis = process.hrtime( startTime )[1] / 1000000;
      logger.debug( "for repeat lookup of NYC (so, cached) took " + elapsedMillis + " milliseconds." );
      expect(elapsedMillis < 2).to.be.ok; // Cache responded quickly"
      done();
      }, function(err) {done(err);}
      );
    }
  );

  });
