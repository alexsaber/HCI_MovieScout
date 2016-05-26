angular.module('app.controllers', [])
  
.controller('homeCtrl', function($scope, $ionicLoading, $state, HttpService, filmData) {
  
  $ionicLoading.show({
    template: 'Loading...'
  });

  HttpService.getInCinema().then(function(searchFilmsRspns) {  
    var inCinemaFims = searchFilmsRspns.data.inTheaters[1].movies;//inTheatersNow: "In Theaters Now"
    console.log(inCinemaFims);
    $ionicLoading.hide();
    $scope.filmsInCinemas = inCinemaFims;
  });

  $scope.goToMovieDescr = function (film) {
      console.log('film is ' + film);
      filmData.setFilm(film);
      $state.go('menu.moviedescription');
  };

  $scope.addToCalendar = function (movie) {

      var title = movie.title;
      var location = '';
      var notes = '';
      var startDate = new Date();
      var endDate = new Date();

      // clean up the dates a bit
      startDate.setMinutes(0);
      endDate.setMinutes(0);
      startDate.setSeconds(0);
      endDate.setSeconds(0);

      // add a few hours to the dates, JS will automatically update the date (+1 day) if necessary
      startDate.setHours(startDate.getHours() + 24);
      endDate.setHours(endDate.getHours() + 26);
      window.plugins.calendar.createEventInteractively(title, location, notes, startDate, endDate, this.onSuccess, this.onError);
  };
})
   
.controller('moviedescriptionCtrl', function($scope, filmData) {
  console.log('entered moviedescriptionCtrl ');
  $scope.film = filmData.getFilm();

  $scope.addToCalendar1 = function () {

      var mov = filmData.getFilm();
      var title = $scope.film.title;
      var location = '';
      var notes = '';
      var startDate = new Date();
      var endDate = new Date();

      // clean up the dates a bit
      startDate.setMinutes(0);
      endDate.setMinutes(0);
      startDate.setSeconds(0);
      endDate.setSeconds(0);

      // add a few hours to the dates, JS will automatically update the date (+1 day) if necessary
      startDate.setHours(startDate.getHours() + 24);
      endDate.setHours(endDate.getHours() + 26);
      window.plugins.calendar.createEventInteractively(title, location, notes, startDate, endDate, this.onSuccess, this.onError);
  };

})


.controller('globalSrchResultsCtrl', function($scope, $state, $ionicLoading, $ionicPopup, foundFilmsData, filmData) {
  console.log('entered globalSrchResultsCtrl ');
   //console.log('foundFilmsData.getFoundFilms() ' + foundFilmsData.getFoundFilms());
  $scope.foundFilms = foundFilmsData.getFoundFilms();
  $ionicLoading.hide();
  
  
  $scope.addToWanted = function(film){
    //console.log('film is asdasdad' + film);
    $scope.data1 = {wanted : false}
    $scope.data2= {watched : false};
    $scope.data3 = {owned : false};
    
    localStorage.setItem("checkwanted", false);
    localStorage.setItem("checkwatched", false);
    localStorage.setItem("checkowned", false);
    
    filmData.setFilm(film);
    var confirmPopup = $ionicPopup.confirm({
      title: 'Add to',
      template: '<div ng-controller="globalSrchResultsCtrl"><ion-checkbox ng-model="data2.watched" ng-click="checked(2)">Watched</ion-checkbox>'+
      '<ion-checkbox ng-model="data1.wanted" ng-click="checked(1)">Wanted</ion-checkbox>'+
      '<ion-checkbox ng-model="data3.owned" ng-click="checked(3)">Owned</ion-checkbox></div>',   
      okText: 'Add'
    });
    
    confirmPopup.then(function(res)
    {
      if(res)
      {
        if(localStorage.getItem("checkwanted") == "true")
        {
         console.log("saving wanted");
  
          localStorage.setItem("speichern", true);
          var oldwanted = JSON.parse(localStorage["wanted"]) || [];
          var newwanted = JSON.stringify(film);
          console.log("newwanted");
          console.log(JSON.parse(newwanted).Title);
          oldwanted.push(newwanted);
          localStorage["wanted"] = JSON.stringify(oldwanted);
         
          localStorage.setItem("wantedcount", parseInt(localStorage.getItem("wantedcount"))+1);
          console.log(localStorage.getItem("wantedcount"));
         
        }
          
         if(localStorage.getItem("checkwatched") == "true")
        {   
          localStorage.setItem("speichern", true);
          
          var oldwatched = JSON.parse(localStorage["watched"]) || [];
          var newwatched = JSON.stringify(film);
         
          console.log(JSON.parse(newwatched).Title);
          oldwatched.push(newwatched);
          localStorage["watched"] = JSON.stringify(oldwatched);
         
          localStorage.setItem("watchedcount", parseInt(localStorage.getItem("watchedcount"))+1);
         
          
          console.log("saving watched");
        }
        
        
        
         if(localStorage.getItem("checkowned") == "true")
        {
          console.log("saving owned");
          localStorage.setItem("speichern", true);
          
          var oldowned = JSON.parse(localStorage["owned"]) || [];
          var newowned = JSON.stringify(film);
         
          //onsole.log(JSON.parse(newowned).Title);
          oldowned.push(newowned);
          localStorage["owned"] = JSON.stringify(oldowned);
         
          localStorage.setItem("ownedcount", parseInt(localStorage.getItem("ownedcount"))+1);
          console.log("LOCALSTORAGE" + parseInt(localStorage.getItem("ownedcount")))
          
        }
        localStorage.setItem("checkwanted", false);
        localStorage.setItem("checkwatched", false);
        localStorage.setItem("checkowned", false);
      }
    })
    
    /*localStorage.setItem("Test", JSON.stringify(film));
    var testvar = JSON.parse(localStorage.getItem("Test"));
    console.log(testvar.Plot);*/
    //console.log(film.Plot);
  }
  
   $scope.checked = function(id)
    {
       if(id == 1)
      {
        if(localStorage.getItem("checkwanted") == "false")
       {
           localStorage.setItem("checkwanted", true);
       }
       else
       {
           localStorage.setItem("checkwatched", false);
       }
      }
       if(id == 2)
      {
       if(localStorage.getItem("checkwatched") == "false")
       {
           localStorage.setItem("checkwatched", true);
       }
       else
       {
           localStorage.setItem("checkwatched", false);
       }
      }
      if(id == 3)
      {
       if(localStorage.getItem("checkowned") == "false")
       {
           localStorage.setItem("checkowned", true);
       }
       else
       {
           localStorage.setItem("checkowned", false);
       }
      }
    }
  
     $scope.goToMovieDescr = function(film){
     console.log('film is ' + film);
     filmData.setFilm(film);
     $state.go('menu.moviedescription');
   }
  
  
})
   
.controller('wantedCtrl', function($scope, $state, filmData) {
  
    console.log("wanted controller");
     
         $scope.showelements = function(){
          console.log("in wanted movies");
          //var wantedmovies = JSON.parse(localStorage["wanted"]) || [];
          
          var len = parseInt(localStorage.getItem("wantedcount"));
          var wantedFilms = new Array();
          for(i = 0; i < len; i++)
          {
              var holder = JSON.parse(localStorage["wanted"])[i];
              var holder2 = JSON.parse(holder);
              wantedFilms[i] = holder2;
             // $scope.test[i].Plot = m.Plot;
              //console.log(JSON.parse($scope.test[i]).Plot);
              //what now??
          }
          $scope.wantedFilms = wantedFilms;
          //savedwatched.setWatchedM($scope.test);
          
          //$scope.testfilm = savedwatched.getWatchedM();
         }
              
         $scope.showelements();
         
         $scope.goToMovieDescr = function(film){
     console.log('film is ' + film);
     filmData.setFilm(film);
     $state.go('menu.moviedescription');
   }  
       
  
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
 
 .controller('ownedCtrl', function($scope, $state, filmData) {
    console.log("owned controller");
    
    $scope.showelements = function(){
      
          //var wantedmovies = JSON.parse(localStorage["wanted"]) || [];
          
          var len = parseInt(localStorage.getItem("ownedcount"));
          var ownedFilms = new Array();
          for(i = 0; i < len; i++)
          {
              var holder = JSON.parse(localStorage["owned"])[i];
              var holder2 = JSON.parse(holder);
              ownedFilms[i] = holder2;
              console.log("what the fuck?");
             // $scope.test[i].Plot = m.Plot;
              //console.log(JSON.parse($scope.test[i]).Plot);
              //what now??
          }
          $scope.ownedFilms = ownedFilms;
          //savedwatched.setWatchedM($scope.test);
          
          //$scope.testfilm = savedwatched.getWatchedM();
         }
              
         $scope.showelements();
         
         $scope.goToMovieDescr = function(film){
     console.log('film is ' + film);
     filmData.setFilm(film);
     $state.go('menu.moviedescription');
   }  
 })
 
 
 .controller('watchedpageCtrl', function($scope, $state, filmData){
          console.log("watched controller");
     
         $scope.showelements = function(){
      
          //var wantedmovies = JSON.parse(localStorage["wanted"]) || [];
          
          var len = parseInt(localStorage.getItem("watchedcount"));
          var watchedFilms = new Array();
          for(i = 0; i < len; i++)
          {
              var holder = JSON.parse(localStorage["watched"])[i];
              var holder2 = JSON.parse(holder);
              watchedFilms[i] = holder2;
             // $scope.test[i].Plot = m.Plot;
              //console.log(JSON.parse($scope.test[i]).Plot);
              //what now??
          }
          $scope.watchedFilms = watchedFilms;
          //savedwatched.setWatchedM($scope.test);
          
          //$scope.testfilm = savedwatched.getWatchedM();
         }
              
         $scope.showelements();
         
         $scope.goToMovieDescr = function(film){
     console.log('film is ' + film);
     filmData.setFilm(film);
     $state.go('menu.moviedescription');
   }  
     
 })
;