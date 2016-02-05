 /* global module, require, L */
'use strict';

/** This module, caching-geocoder, geo-codes location names: it maps
  * from names to coordinates, returning Promises.
  *
  * caching-geocoder also maintains a cache of said Promises. Further
  * there is a mechanism for pre-fetching individual mappings, so
  * that the cache can be pre-populated without network traffic, say,
  * during app initiation i.e. the cache can be primed.
  *  
  * Note, using Google's terminology:
  * 1. "geocoding" is mapping from names to coordinates
  * 2. "reserve geocoding" is mapping location to name
  * See: https://developers.google.com/maps/documentation/geocoding/
  *
  * OSM uses the same terminology:
  * ttp://wiki.openstreetmap.org/wiki/Nominatim
  *
  * At this time, caching-geocoder does not do reverse geocoding.
  */

module.exports = {
  locate:        locate,
  setPrefetched: setPrefetched,
  resetCache:    resetCache,
  exportCache:   exportCache,
  getCacheSize:  getCacheSize
  };


// naming: if superAgent is the plain SuperAgent module, then supestAgent is that wrapped in Bluebird Promises.
var supestAgent = require('superagent-bluebird-promise');

// JFT-TODO: kill off, once SuperAgent is wired in.
var http = require('http');
// Supposedly this is not needed
//var superAgent = require('superagent');

var urlQueryTermer = require('querystring');
var Promise = require('bluebird');

var logger = require('../utils/logger.js')('jft');
logger.level('debug');


var cachedPromises = {};
var cacheMembersCount = 0;

function getCacheSize(){
  return cacheMembersCount;
  // JFT-TODO: style-wise, this seems overly complex. Why not just let them access the prop directly?
  }

function exportCache(){
  return cachedPromises.toJSON();
  // JFT-TODO: a one statement function. Really?
  // Again, could just users of this module just access cachedPromises and let them decide to toJSON() it if desired.
  // What is the gain of encapsulation here?
  } 

function setPrefetched(aLocName, aLat, aLong){
  if(cachedPromises[aLocName]){
    logger.info('setPrefetched(): cache already has:' + aLocName);
    }
    else{
      var aCannedPromise = Promise.resolve([{lat: aLat, lon: aLong}]);   
      addToCache(aLocName, aCannedPromise);
      }
  }

function resetCache(){
  cacheMembersCount = 0;
  cachedPromises = {};
  }

function addToCache(aName, aPromise){
  cachedPromises[aName] = aPromise;
  cacheMembersCount++;
  }

function locate(aName){
  logger.debug('getLocationPromise(' + aName + ') and cache for it is:' + cachedPromises[aName]);

  if(cachedPromises[aName]){
    logger.debug('cache already has:' + aName);
    }
    else{
      logger.debug('cache does not have:' + aName);
      //addToCache(aName, DEAD_makePromiseForLoc(aName));
      addToCache(aName, promiseLocCoords(aName));
      }
  logger.debug('getLocationPromise returning:' + cachedPromises[aName]);

  return cachedPromises[aName];
  }


/*
JFT-TODO:
need to test in browser now. 
!!!!!So that's the next level-up in my testing.
  also need to have elegant way of detecting both cases. 
Not sure if I have to adopt Browserify fully.
  Browserify does makes nodes http.request work in the browser. 
  can just that be pulled out of browserify? Indeed:
  https://github.com/substack/http-browserify
  Nice compatibility: https://github.com/substack/http-browserify#compatibility


This also gets to CORS
  http://visionmedia.github.io/superagent/#cors
  browserify does it this way
    http://stackoverflow.com/questions/23896619/make-http-request-in-node-js-work-for-browser
      withCredentials: false // this is the important part
  If CORS is not setup, Nominatim can do jsonp and I thought I saw source code of Nominatim v3(?) doing CORS:
    http://wiki.openstreetmap.org/wiki/Nominatim
    json_callback=<string>
*/

function promiseLocCoords(aName){
  var host = 'nominatim.openstreetmap.org';
  var path = '/search/?q=' + urlQueryTermer.escape(aName) + '&limit=5&format=json&addressdetails=1';
  var builtUpUrl = "http://" + host + path;

  logger.debug('requesting ' + builtUpUrl);

  return supestAgent.get(builtUpUrl).then(function(aResp){
    return aResp.body;
    });
  // JFT-TODO: superagent-bluebird-promise replaces SuperAgent's end() with a then()
  // Could add a null then() here to start it off but probably not needed.


/*
There might be a workaround


        .then(function(aResp){
//THIS CHUNK HERE is the double callbacker
//Just calling then does it w or w/o any statements
          //must(aResp.status).equal(200);
          // The following form give lame error message like: AssertionError: false must be true
          // must(/John Tigue/.test(aResp.text)).true();
	  // So instead the following (at cost of no regexp but better message):  
//          must(aResp.text).include('foo bar');
          console.log(aResp);

          })
        .catch(function(aReason){
          console.log(aReason);
          });
    .then(function(aResp){
      return aResp.body;
      })
    .catch(function(aProblem){
console.log(aProblem);
      throw aProblem;
      });
var foo = {}
foo.then = function(){};
return foo;
//  return new Promise(function fuckIt(resolve){resolve([{lat:48,lon:-122}]);});
//      must(seattleResult.long).between(-122.8, -121.8);
//      must(seattleResult.lat).between(47.1, 48.1);
 */

  }





// This is the pre-SuperAgent implementation. http.request() is a node thing. 
// Browserify could get a syntactically identical implementation in the browers.
// Yet Promise.promisify can be more efficient and SuperAgent has a more elegant, modern
// API than http.request.
function DEAD_makePromiseForLoc(aName){
  var aPromise = new Promise(function(resolve, reject){   
    var host = 'nominatim.openstreetmap.org';
    var path = '/search/?q=' + urlQueryTermer.escape(aName) + '&limit=5&format=json&addressdetails=1';
    var builtUpUrl = "http://" + host + path;

    logger.debug('requesting ' + builtUpUrl);

    var nominatimRequestOpts = {
      hostname: host,
      port: 80,
      method: 'GET',  
      path: path
      };

    // JFT-TODO: This is the sort of thing that a debugger should be used for....
    //logger.warn("requestURL:"+host+path);
    var aReq = http.request(nominatimRequestOpts, function(response){
      logger.debug('http.request called back');
      var respBody = '';
      response.on('data', function(aChunk){
        respBody += aChunk; 
        });
      response.on('end', function(){
        logger.debug('response ended');
        try{
          resolve(JSON.parse(respBody));
          }
          catch(e){
            reject(e);
            } 
        }); 
      })
      .on('error', function(anErr){
        logger.error(anErr);
        throw anErr;
        });
    aReq.end();
    });
  return aPromise;
  }


// JFT-TODO: is this dead code now? 
// It could be used but looks like I just stopped at resolve(JSON.parse(respBod)).
// Currently caching-geocoder.spec.js dots into the data raw.
// The unbound var L is ugly and makes it Leaflet specific (with it's global object in a server...)
// Really, why have it? Can I just duck type it?
//   what does L.latLngBounds() and L.latLng() return?

/* Ripped straight out of Control.Geocoder.js geocode(), re-formatted a bit. 
 * This just rearranges the data a bit, parses strings to numbers, and Leaflets it up (the unbound var L)
 */
function parseNominatimResponse(aResponseBody){
  var results = [];
  var data = JSON.parse(aResponseBody);
  for(var i = data.length - 1; i >= 0; i--){
    var bbox = data[i].boundingbox;
    for(var j = 0; j < 4; j++) bbox[j] = parseFloat(bbox[j]);
    results[i] = {
      icon: data[i].icon,
      name: data[i].display_name,
      html: null,
      bbox: L.latLngBounds([bbox[0], bbox[2]], [bbox[1], bbox[3]]),
      center: L.latLng(data[i].lat, data[i].lon),
      properties: data[i]
      };
    }    
  return results;
  }
