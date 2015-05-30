'use strict';

/** src/utils/geocoder-precache-builder.js
  *
  * This thing's job is to:
  *   1. Load in a CSV file which contains geo location names in a column
  *   2. Have a geocoder look up each name's coordinates
  *   3. Write to a file the mapping from the names => [long,lat]
  *
  * The output is JSON, good for SPA JS apps to read as simple as possibly. 
  * 
  * The resulting files are quite handy for initializing the cache in
  * a geocode., Without front loading its cache with this pre-fetched
  * data a, say, SPA's geocoder would otherwise need to do a lot of
  * network traffic during initialization.

JFT-TODO:
When a precache file is read later in a browser, the locs are
instantiated as instantly resolved Promises of locations and all
added/precached to cachedPromises there is a way to prepopulate the
lookup table with Promises that are force-born resolve()d using, say,
values from a precache data struct JSON from a relative URL file or
inlined/bundled

  */

 /*
  * JFT-TODO: Any benefit to outputting to CSV? Consistency? 
  *   No. Nominatim answers in JSON. But humanitarian types might like CSV...
  * Could just do both with a commandline switch
  * So, this precache file that is being built ahead of time...
  * What is written to file is name-->longLat (as JSON or CSV?)
  */
 
var geocoder = require( '../geo-librarian/caching-geocoder' );

module.exports = {
  
  };

function haveGeocoderLookupAllTheseNames(anArrayOfNames){
  // No need to collate and dedup, the cache will collate the names for free.

  throw "unimpl'd haveGeocoderLookupAllTheseNames(anArrayOfNames)";
  }





// geocoder.locate( "Seattle" ).then( function( aLongLat ) { addToNameLocateMap( "Seattle", aLongLat ) } )
// somehow do a parallel via map() or reduce() s.t. all names are looked up and once all are looked up, then write NameLocateMap's content to JSON and save as file.
//   or maybe that's a batch action? need to go check on Nominatim docs  
