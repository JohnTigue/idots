/* global console, require, describe, context, before, beforeEach, after, afterEach, it */


Actually, this is a geocoder-cache-builder.spec.js (yup, already changed that name)
a geocoder-cache-builder.js builds a cache; how the 
cache is used is a separate issue/concern. The cache could
be used in a node server (or other non-js server) or it could
be loaded as a single file by a client in browsers to 
pre-fetch a bunch of name-to-loc mappings. Calling it
a geocoder-precache-builder is wrong.

Combined with a browser storage persistence mechanism and 
a rate limiter, the OSM folks might very much like to 
promote it.


/** geocoder-cache-builder.spec.js is a command-line utility useful
  * during build and deploy.  
  *
  * It takes in data files containing geographical location names and
  * translates them to (latitude, longitude) coordinates by looking
  * them up in a geocoder. The resulting 3-tuple mappings are then
  * persisted somewhere and can subsequently be used to, say, load a
  * geocoder's cache with pre-fecthed information. Specifically this
  * is done in this project in order to pre-load caching-geocoder.js.
  *
  * The purpose is to avoid forcing, say, a SPA in a browser to slowly
  * go to a remote geocoder many times during start-up in order to do
  * the geocoding on all the data it will be rendering.
  *
  * For an explantion of of this fat-before()s BDD test coding style,
  * wherein much of the work is done in the before hooks rather than
  * the it()'s, see (spoiler: designing a FSA via Give-When-Then):
  *   https://sites.google.com/site/unclebobconsultingllc/specs-vs-tests
  */
describe('geocoder-cache-builder.spec.js', function(){
  'use strict';

  var bunyan = require('bunyan');
  var logger = bunyan.createLogger({name: 'myapp'});
  logger.level('debug');
  
  // JFT-TODO: if sticking with Must.js then add it to dev-deps
  var must = require('must');

  var Promise = require('bluebird');  

  // JFT-TODO: these 2 needed?:
  var http = require('http');
  var url_query_termer = require('querystring');

  // SUT
  var precacher = require( '../src/utils/geocoder-precache-builder' );
  
  context('when (in node) passed the name of a file containing location names', function(){
    it('should load and parse the CVS file', function(){
      must(true).equal(false); //JFT-TODO
      });

    it('should fetch geocode for "New York City" i.e. hasSpaces()', function(done) {
      return precacher.locate( 'New York City' ).then( function( locs ) {
        var nycLong = parseInt( locs[0].lon );
        logger.debug( 'in NYC\'s then() locs.length=' + locs.length  + ' and locs[0].long=' + locs[0].lon + ' aka ~' + nycLong );
        must(nycLong).equal(-73); //'NYC is circa 73 degrees west of the prime meridian' );
        done();
        }
        );
      });
    });

  context('BLANK FOR HANDLING PROMISE', function(){
    var bPromise = null;
    before(function(){
      bPromise = new Promise(function(resolve, reject){
        resolve('basically, unit');
        });
      });

    // Notice how there is no need for a done callback in the params of the function passed in.
    // With a simple (i.e. non-Promise) async callback, that function def would need to function(done){}
    // but because it() returns the Promise synchronously, no done() is needed to handle asynch-ery,
    // yet then() will happen asynchronously. Mocha is tight like that.
    it.only('should find the supplied resolved value in then()', function(){
      return bPromise.then(function(aValue){
        must(aValue).equal('basically, unit');//, 'bPromise insta-resolved like unit');
        });
      });
    });


  /* JFT-TODO: Not sure this should be in this file. But no more appropriate place yet.

Well, do want to use the caching-geocoder.js to actually build the pre-cache list so
this might go somewhere else eventually but it's needed here now. Refactor later.
   */

  /** The geocoder's cache can be pre-populated by passing it pre-fetched fulfilled Promises with 
    * the geo-coords of named locations. The SPA is config'd with an HTTP URL of a file
    * containing the mapping from certain location names to geo-coords. I.e. a set of
    * String => [float, float] mappings.
    * 
    * The mapping file can be JSON or CSV. If it's a CVS file then it contans one mapping
    * per row with 3 columns: name, latitude, longitude i.e. a mapping from name to [lat, long]
    * using #HXL tags in row 2 for IDing the columns.
    *
    * The CSV format (and #HXL) is supported because some deployers of this technology may well have
    * an easier time generating CSV than JSON. For example, many humanitarian people are not
    * coders but they are right at home with spreadsheets.
    */
  context('when passed an URL of a Resource containing a name-to-geo-coords mapping', function(){
    it.skip('should pre-load the cache via fully qualified HTTP URL', function(){
      });
    it.skip('in browser: load via relative HTTP URL', function(){
      });
    it.skip('in node: load via fully qualified filename i.e. starts file://', function(){
      });
    });
  });


  


