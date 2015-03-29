'use strict';
var http = require('http');
var url_query_termer = require('querystring');
var Promise = require('promise');

var bunyan = require('bunyan' );
var logger = bunyan.createLogger( {name: 'caching-geocoder'} );
logger.level( 'warn' );

/** This module maintains a loopup table of location names and if it already has a Promise for a name then it simply returns the preexisting. 
  * This way only go to the network once for each piece of data.
  */
var cachedPromises = {}

module.exports = {
  locate: function( aName ){
    return getLocationPromise( aName )
    },
  name: function( someCoordinates ) { return promiseOfName },
  load_cache: function ( anUrl ) {},
  dump_cache: function () { return cachedPromises.toJSON() } 
  }


function getLocationPromise( aName ) {
  'use strict'
  logger.debug( 'getLocationPromise(' + aName + ') and cache for it is:' + cachedPromises[ aName ] );

  if( cachedPromises[ aName ] ) {
    logger.info( 'cache already has: ' + aName )
    }
  else {
    logger.info( 'not cached:' + aName );

    cachedPromises[ aName ] = new Promise( function ( resolve, reject ) {   
      var host = 'nominatim.openstreetmap.org'
      var schemeAndHost = 'http://' + host
      var path = '/search/?q=' + url_query_termer.escape( aName ) + '&limit=5&format=json&addressdetails=1'
      var builtUpUrl = schemeAndHost + path

      logger.debug( 'requesting ' + builtUpUrl );

      /*
      var req = http.get( builtUpUrl, function( err, resp, body ) {
        logger.debug( 'resp=' + resp )
        if( err )
           reject( err )
        resolve( parseNominatimResponse( body ) ) 
        })
      req.on('error', function(e) {
          logger.error( 'problem with request: ' + e.message );
          }
        )
      */

      var nominatimRequestOpts = {
        hostname: host,
        port: 80,
        method: 'GET',  
        path: path
        }
  
  
      var aReq = http.request( nominatimRequestOpts, function( response ) {
        logger.debug( 'http.get called back' );
        var respBod = '';
        response.on( 'data', function( aChunk ) {
          respBod += aChunk 
          })
        response.on( 'end', function() {
          var bodAsJson = JSON.parse( respBod )
          logger.debug( 'response ended' )
          resolve( bodAsJson )
          }) 
        })
        .on( 'error', function( anErr ) { logger.error( anErr ) } )
  
      aReq.end()
      })
    }
  logger.debug( 'getLocationPromise returning:' + cachedPromises[ aName ] );

  return cachedPromises[ aName ]
  }


/* ripped straight out of Control.Geocoder.js geocode(): */
function parseNominatimResponse( aResponseBody ) {
  var results = []
  var data = JSON.parse( aResponseBody )
  for (var i = data.length - 1; i >= 0; i--) {
    var bbox = data[i].boundingbox
    for (var j = 0; j < 4; j++) bbox[j] = parseFloat(bbox[j]);
    results[i] = {
      icon: data[i].icon,
      name: data[i].display_name,
      html: null,
      bbox: L.latLngBounds([bbox[0], bbox[2]], [bbox[1], bbox[3]]),
      center: L.latLng(data[i].lat, data[i].lon),
      properties: data[i]
      }
    }    
  return results
  }


    
 
