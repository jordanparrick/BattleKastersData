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
      .state('tutorial', {
        url: '/tutorial',
        templateUrl: 'app/tutorial/tutorial.html',
        controller: 'TutorialController',
        controllerAs: 'tutorial'
      })
      .state('route2', {
        url: '/route2',
        templateUrl: 'app/tutorial/route2.html',
        controller: 'TutorialController',
        controllerAs: 'tutorial'
      })


    ;

    $urlRouterProvider.otherwise('/');
  }

})();
