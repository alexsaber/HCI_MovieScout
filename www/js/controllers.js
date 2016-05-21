angular.module('app.controllers', [])
  
.controller('homeCtrl', function($scope) {

})
   
.controller('moviedescriptionCtrl', function($scope, filmData) {
  console.log('entered moviedescriptionCtrl ');
  $scope.film = filmData.getFilm();
})


.controller('globalSrchResultsCtrl', function($scope, $state, $ionicLoading, foundFilmsData, filmData) {
  console.log('entered globalSrchResultsCtrl ');
   //console.log('foundFilmsData.getFoundFilms() ' + foundFilmsData.getFoundFilms());
  $scope.foundFilms = foundFilmsData.getFoundFilms();
  $ionicLoading.hide();
  
     $scope.goToMovieDescr = function(film){
     console.log('film is ' + film);
     filmData.setFilm(film);
     $state.go('menu.moviedescription');
   }
  
  
})
   
.controller('wantedCtrl', function($scope) {

})
      
.controller('globalSrchCtrl', function($scope, $q, $state, $ionicLoading, HttpService, filmData, foundFilmsData) {
  console.log("globalSrchCtrl");
  
  $scope.search = function() {
    
    $ionicLoading.show({
      template: 'Loading...'
    });

    var searchTitle = document.getElementById("searchTitle").value;
    var searchYear = document.getElementById("searchYear").value;
    var selectedType = document.getElementById("selectedType").value.toLowerCase();
    if(selectedType == 'any')
      selectedType = '';
    console.log("searchTitle: " + searchTitle);
    console.log("searchYear: " + searchYear);
    console.log("selectedType: " + selectedType);
    if(searchTitle != null){
      HttpService.searchFilms(searchTitle, searchYear, selectedType).then(function(searchFilmsRspns) {  
        $scope.films = searchFilmsRspns.Search;
        console.log($scope.films);
        var promises = [];
        for (var i in $scope.films) {
        if ($scope.films.hasOwnProperty(i)) {   
            promises.push(HttpService.searchIMDB($scope.films[i].imdbID));
         }
        }
         $q.all(promises).then(function(results){
          var counter = 0;
          results.forEach(function(data,status,headers,config){
            $scope.films[counter].Plot = data.Plot;
            $scope.films[counter].Actors = data.Actors;
            $scope.films[counter].Poster = data.Poster;
            counter++;
          });
          
          //console.log('setting fondFilms: ' + $scope.films); 
          foundFilmsData.setFoundFilms($scope.films);
          $state.go('menu.globalSrchResults');
        });
       // console.log(' $scope.showFilms = $scope.films;'); 
        
      });
      //end of if
    }
    
  }; 
  
  
})
 
 .controller('watchedpageCtrl', function($scope){
     
     
 });