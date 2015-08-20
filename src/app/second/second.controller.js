(function() {
  'use strict';

  angular
    .module('battleKasterData')
    .controller('SecondController', MainController);

  /** @ngInject */
  function MainController($timeout, webDevTec, toastr) {
    var second = this;

    second.greeting = 'Second Welcome';





// Seth's code
    second.awesomeThings = [];
    second.classAnimation = '';
    second.creationDate = 1438801089625;
    second.showToastr = showToastr;

    activate();

    function activate() {
      getWebDevTec();
      $timeout(function() {
        second.classAnimation = 'rubberBand';
      }, 4000);
    }

    function showToastr() {
      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      second.classAnimation = '';
    }

    function getWebDevTec() {
      second.awesomeThings = webDevTec.getTec();

      angular.forEach(second.awesomeThings, function(awesomeThing) {
        awesomeThing.rank = Math.random();
      });
    }
  }
})();