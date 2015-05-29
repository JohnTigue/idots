/** ROWCA is the UN agency (sure militaries like short acronyms. The UN is comfortable with long ones)
  * that publishes the detailed (as detailed as they will allow the public to have) reports of disease cases.
  * This command linable util HTTP fetches report from ROWCA and injests them into this system
  */

var bunyan = require( 'bunyan' );
var logger = bunyan.createLogger( {name: 'myapp'} );
logger.level( 'info' );

var test = require( 'tape' );
var http = require( 'http' );

// JFT-TODO
//um, really? not sure. or maybe this is one of the tasks.
//var cacher = require( '../assets/js/construct_preload_cache_of_locations.js' );
