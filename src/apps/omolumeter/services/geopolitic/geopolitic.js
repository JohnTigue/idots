(function(){
  'use strict';

  // Set up flag images with $mdIconProvider
  var squareFlagsRoot = 'svg/flags/1x1/';
  angular.module('omolumeterApp').config(['$mdIconProvider', function($mdIconProvider){
    $mdIconProvider
      .icon('flag:esp', buildFlagUrl('es.svg'), 512)
      .icon('flag:gin', buildFlagUrl('gn.svg'), 512)
      .icon('flag:gbr', buildFlagUrl('gb.svg'), 512)
      .icon('flag:ita', buildFlagUrl('it.svg'), 512)
      .icon('flag:lbr', buildFlagUrl('lr.svg'), 512)
      .icon('flag:mli', buildFlagUrl('ml.svg'), 512)
      .icon('flag:nga', buildFlagUrl('ng.svg'), 512)
      .icon('flag:sen', buildFlagUrl('sn.svg'), 512)
      .icon('flag:sle', buildFlagUrl('sl.svg'), 512)
      .icon('flag:usa', buildFlagUrl('us.svg'), 512);
    }]);
  function buildFlagUrl(aFlagResourceUrl){
    // JFT-TODO: when move outbreak.js getAbsoluteUrl() to a service, use that here.
    return squareFlagsRoot + aFlagResourceUrl;
    }
  
  angular.module('omolumeter.geopolitic', []).factory('geopoliticService', GeopoliticalService);
  var geopoliticalService = {};

  // these should probably be coming out of a separate file (JSON or CSV)
  // Should the flagIconUrl be in here too?
  var _locations = [
    {iso3Code: 'ESP', iso2Code: 'ES', name: 'Spain',                    flagIcon: 'flag:esp', color:'#c60b1e'},
    {iso3Code: 'GIN', iso2Code: 'GN', name: 'Guinea',                   flagIcon: 'flag:gin', color:'#090'},
    {iso3Code: 'GBR', iso2Code: 'GB', name: 'United Kingdom',           flagIcon: 'flag:gbr', color:'#c00'},
    {iso3Code: 'ITA', iso2Code: 'IT', name: 'Italy',                    flagIcon: 'flag:ita', color:'#fc0000'},
    {iso3Code: 'LBR', iso2Code: 'LR', name: 'Liberia',                  flagIcon: 'flag:lbr', color:'#006'},
    {iso3Code: 'MLI', iso2Code: 'ML', name: 'Mali',                     flagIcon: 'flag:mli', color:'#009a00'},
    {iso3Code: 'NGA', iso2Code: 'NG', name: 'Nigeria',                  flagIcon: 'flag:nga', color:'#36a100'},
    {iso3Code: 'SEN', iso2Code: 'SN', name: 'Senegal',                  flagIcon: 'flag:sen', color:'#0b7226'},
    {iso3Code: 'SLE', iso2Code: 'SL', name: 'Sierra Leone',             flagIcon: 'flag:sle', color:'#0000cd'},
    {iso3Code: 'USA', iso2Code: 'US', name: 'United States of America', flagIcon: 'flag:usa', color:'#192f5d'}
    ];

  // build some indexes for all countries for quick lookup
  var _locationsByIso3Code = [];
  var _locationsByName = [];  
  _locations.forEach(function(aLoc){
    _locationsByIso3Code[aLoc.iso3Code] = aLoc;
    _locationsByName[aLoc.name] = aLoc;   
    aLoc.flagUrl = buildFlagUrl(aLoc.iso2Code.toLowerCase() + '.svg');
    });
  
  function GeopoliticalService(){    
    geopoliticalService.getCountryByName = getCountryByName;
    geopoliticalService.lookupCountryByISO3 = lookupCountryByISO3;      
    return geopoliticalService;
    }

  function getCountryByName(aCountryName){
    //console.log('looking up ' + aCountryName + ':' + mapCountryNameToIso3(aCountryName));
    return lookupCountryByISO3(mapCountryNameToIso3(aCountryName));
    };

  function lookupCountryByISO3(aCountryIso3){
    return _locationsByIso3Code[aCountryIso3];
    }

  // JFT-TODO: this is stupid. Should have an array locations.byIso3Code["USA"]
  function mapCountryNameToIso3(aCountryName){
    var anIso3Code = null;
    var aLoc = _locationsByName[aCountryName];   
    if(aLoc)
      anIso3Code = aLoc.iso3Code;
    if(anIso3Code)
      return anIso3Code;
    else
      throw new Error('Unknown country named:"' + aCountryName + '"'); 
  }
  
  GeopoliticalService.$inject = [];
  
})();
