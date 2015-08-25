/* global malarkey:false, toastr:false, moment:false */
(function() {
  'use strict';

  angular
    .module('battleKasterData')
    .constant('malarkey', malarkey)
    .constant('toastr', toastr)
    .constant('moment', moment)
    .constant('baseUrl', "http://orkneyv1-2.artifacttech.com:3001");

})();
