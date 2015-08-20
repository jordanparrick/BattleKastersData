/* global malarkey:false, toastr:false, moment:false */
(function() {
  'use strict';

  angular
    .module('battleKasterData')
    .constant('malarkey', malarkey)
    .constant('toastr', toastr)
    .constant('moment', moment)
    .constant('baseUrl', "https://orkney-pax.herokuapp.com");

})();
