'use strict';

/** This module, caching-geocoder, geo-codes location names: it maps
  * from names to coordinates, returning Promises.
  *
  * caching-geocoder also maintains a cache of said Promises. Further
  * there is a mechanism for pre-fetching individual mappings, so
  * that the cache can be pre-populated without network traffic.
  *  
  * Note: using Google terminology, "geocoding" is mapping from names
  * to coordinates, and likewise "reserve geocoding" is mapping 
  * location to name:
  *   https://developers.google.com/maps/documentation/geocoding/
  * At this time, caching-geocoder does not do reverse geocoding.
  */

var http = require('http');
var urlQueryTermer = require('querystring');
var Promise = require('promise'); // This is Lindesay's original style.

var bunyan = require('bunyan');
var logger = bunyan.createLogger({name: 'caching-geocoder'});
logger.level('warn');

var cachedPromises = {}
var cacheMembersCount = 0;

module.exports = {
  locate:        getLocationPromise,
  setPrefetched: setPrefetched,
  clearCache:    drainCache,
  dumpCache:     dumpCache,
  getCacheSize:  getCacheSize
  }

/* JFT-TODO: should this be expanded to where reverse geocoding is done, or
 * is that a separate module? Something would have a function like:
 *   module.exports.name: function(aLatAndLong){return promiseOfName;} 
 */

function getCacheSize(){
  return cacheMembersCount;
  // JFT-TODO: style-wise, this seems overly complex. Why not just let them access the prop directly?
  }

function dumpCache(){
  return cachedPromises.toJSON();
  // JFT-TODO: a one statement function. Really?
  } 

function setPrefetched(aLocName, aLat, aLong){
  if(cachedPromises[aLocName]){
    logger.debug('setPrefetched(): cache already has:' + aLocName);
    }
  else{
    var aCannedPromise = new Promise(function(resolve, reject){
      resolve([{lat: aLat, lon: aLong}]);
      });
    addToCache(aLocName, aCannedPromise);
    }
  }

function drainCache(){
  cacheMembersCount = 0;
  cachedPromises = {};
  }

function addToCache(aName, aPromise){
  cachedPromises[aName] = aPromise;
  cacheMembersCount++;
  }

function getLocationPromise(aName){
  logger.debug('getLocationPromise(' + aName + ') and cache for it is:' + cachedPromises[aName]);

  if(cachedPromises[aName]){
    logger.debug('cache already has:' + aName);
    }
  else{
    logger.debug('cache do not has:' + aName);
    addToCache(aName, makePromiseForLoc(aName));
    }
  logger.debug('getLocationPromise returning:' + cachedPromises[aName]);

  return cachedPromises[aName];
  }

function makePromiseForLoc(aName){
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
      }

    // JFT-TODO: This is the sort of thing that a debugger should be used for....
    //logger.warn("requestURL:"+host+path);
    var aReq = http.request(nominatimRequestOpts, function(response){
      logger.debug('http.request called back');
      var respBod = '';
      response.on('data', function(aChunk){
	respBod += aChunk; 
	})
      response.on('end', function(){
	var bodAsJson = JSON.parse(respBod);
	logger.debug('response ended');
	resolve(bodAsJson);
	}) 
      })
      .on('error', function(anErr){
	logger.error(anErr);
	// JFT-TODO: and then what?
	});
    aReq.end();
    })
  return aPromise;
  }


/* ripped straight out of Control.Geocoder.js geocode(), formatted a bit. */
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
      }
    }    
  return results;
  }


    
 
