(function() {
  'use strict';

  angular
    .module('battleKasterData')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('graph', {
        url: '/graph',
        templateUrl: 'app/graph/graph.html',
        controller: 'GraphController',
        controllerAs: 'g'
      })
      .state('testPage2', {
        url: '/TestPage2',
        templateUrl: 'app/TestPage2/mychart2.html',
        controller: '',
        controllerAs: ''
      })
      .state('secondPage', {
        url: '/second',
        templateUrl: 'app/second/second.html',
        controller: 'SecondController',
        controllerAs: 'second'
      })
    ;

    $urlRouterProvider.otherwise('/');
  }

})();
