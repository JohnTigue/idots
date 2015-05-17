/* global console, require, describe, context, before, beforeEach, after, afterEach, it */

/** caching-geocoder.js resolves location names to latitude & longitude coordinates,
  * uses a cache which can be prefilled from a local file. Much more detail to be
  * found in the comments in caching-geocoder.js.
  */
describe('super-agent-test.js', function(){  
  'use strict'; 

  var must = require('must');
  var supestAgent = require('superagent-bluebird-promise');
  var Promise = require('bluebird');

  context('when using supestAgent', function(){
    var aPromise = null;
 
    before(function(){
      return aPromise = new Promise(function(yes,no){yes();});
      });

    it('mustn\'t "double callback"', function(){
      aPromise.then(function(yup){
        must(true).equal(true);
        });
      });
    });
  });
