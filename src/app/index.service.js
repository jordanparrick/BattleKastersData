// trying to test services but don't know where to put the function

(function() {
  'use strict';

  angular
    .module('battleKasterData')
    .service('greeting', greetingFunction);

  /** @ngInject */
  function greetingFunction() {
  	var greeting = this;

  	greeting.message = 'Default';

  }
})