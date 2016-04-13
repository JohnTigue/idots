(function(){
'use strict';

angular.module('omolumeter.introduction', []).component('introduction', {
  templateUrl: 'components/introduction/introduction.html',
  controllerAs: 'vm',
  controller: ['outbreakService', '$window', function(outbreakService, $window){
    console.log('introduction.js: constructor');
    var vm = this;
    }]
});
}());
