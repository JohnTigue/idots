'use strict';

/** Very basic sanity check of node being able to communicate with Open Street Map's Nominatium geocoder.
  * Nominatim is given names, say, "Seattle" and it returns a array of possible matches.
  * The multiplicity of answers results from multiple entries being in Nominatum.
  * The answers are usually right but may vary a wee bit in lat and long.
  */

var bunyan = require( 'bunyan' );
var logger = bunyan.createLogger( {name: 'myapp'} );
logger.level( 'info' );

var expect = require('chai').expect;
var http   = require( 'http' );

describe( 'Nominatim on net' , function() {
  var someRequestOpts = {
    hostname: 'nominatim.openstreetmap.org',
    port: 80,
    method: 'GET',      
    path: '/search/?q=Seattle&limit=5&format=json&addressdetails=1'
    };

  it( 'should 200 for Seattle (not looking at Response body)', function( done ) {
    var aRequest = http.request( someRequestOpts, function( aResponse ) {
        logger.debug( 'Status code=' + aResponse.statusCode );
        expect( aResponse.statusCode, 'Status code' ).to.equal( 200 );
	done();
        }
      );

    logger.trace( aRequest );
    aRequest.on( 'error', done );
    aRequest.end();
    });

  it( "should say Seattle's lat ~= 47", function( done ) {
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
            expect( seattleLatInt, "Seattle's lat(i.e. 47)" ).to.equal( 47 );
	    done();
            }
          ); 
        }
      ).on( 'error', done );
    aReq.end();
    });

  });
  

