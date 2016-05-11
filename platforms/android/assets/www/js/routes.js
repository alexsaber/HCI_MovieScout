angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('menu.home', {
    url: '/page1',
    views: {
      'side-menu21': {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      }
    }
  })

  .state('moviedescription', {
    url: '/page2',
    templateUrl: 'templates/moviedescription.html',
    controller: 'moviedescriptionCtrl'
  })

  .state('wanted', {
    url: '/page3',
    templateUrl: 'templates/wanted.html',
    controller: 'wantedCtrl'
  })

  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    abstract:true
  })

  .state('page', {
    url: '/page4',
    templateUrl: 'templates/page.html',
    controller: 'pageCtrl'
  })

$urlRouterProvider.otherwise('/side-menu21/page1')

  

});