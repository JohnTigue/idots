/* global module */

module.exports = function configBunyan(aName){
  'use strict';
  var bunyan = require('bunyan');
  var bunyanDebugStream = require('bunyan-debug-stream');

  return bunyan.createLogger({
    name: aName,
    streams: [{
      level:  'info',
      type:   'raw',
      stream: bunyanDebugStream({
        //basepath: __dirname // this should be the root folder of your project.
        colors: {
          'debug': 'blue',
          'info': 'yellow',
          'error': ['red', 'bold']
          }
        })
      }],
      serializers: bunyanDebugStream.serializers
    });
  };
