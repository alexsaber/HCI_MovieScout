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

  .state('menu.owned',{
    url:'/owned',
    views: {
      'side-menu21' : {
        templateUrl: 'templates/owned.html',
        controller: 'ownedCtrl'
      }
    }
  })

  .state('menu.moviedescription', {
    url: '/page2',
    views: {
      'side-menu21': {
    templateUrl: 'templates/moviedescription.html',
    controller: 'moviedescriptionCtrl'
    }
    }
  })
  
  .state('menu.globalSrchResults', {
    url: '/globalSrchResults',
    views: {
      'side-menu21': {
    templateUrl: 'templates/globalSrchResults.html',
    controller: 'globalSrchResultsCtrl'
    }
    }
  })
  
    .state('menu.globalSrch', {
    url: '/globalSrch',
    views: {
      'side-menu21': {
    templateUrl: 'templates/globalSrch.html',
    controller: 'globalSrchCtrl'
    }}
  })

  .state('menu.wanted', {
    url: '/page3',
    views: {
      'side-menu21': {
    templateUrl: 'templates/wanted.html',
    controller: 'wantedCtrl'
    }}
  })

  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    abstract:true
  })


  

  
  .state('menu.watchedpage', {
    url: '/watchedpage',
    views: {
      'side-menu21': {
    templateUrl: 'templates/watched.html',
    controller: 'watchedpageCtrl'
    }}
  })

$urlRouterProvider.otherwise('/side-menu21/page1')

  

});