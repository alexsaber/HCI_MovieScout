angular.module('app.controllers', [])
  


.controller('homeCtrl', function($scope, $ionicLoading, $state, $ionicPopup, HttpService, filmData) {
 
  $ionicLoading.show({
    template: 'Loading...'
  });
  
  
  HttpService.getInCinema().then(function(searchFilmsRspns) {  
    var inCinemaFims = searchFilmsRspns.data.inTheaters[1].movies;//inTheatersNow: "In Theaters Now"
    console.log(inCinemaFims);
    $ionicLoading.hide();
    $scope.filmsInCinemas = inCinemaFims;
  });
  
  
  $scope.addToList = function(inCinemaFims){
    //console.log('film is asdasdad' + film);
    console.log("in addToList homeCTRL");
    $scope.data11 = {wanted : false}
    $scope.data22= {watched : false};
    $scope.data33 = {owned : false};
    
    localStorage.setItem("checkwanted", false);
    localStorage.setItem("checkwatched", false);
    localStorage.setItem("checkowned", false);
    localStorage.setItem("popup", true);
    
    filmData.setFilm(inCinemaFims);
    var confirmPopup1 = $ionicPopup.confirm({
      title: 'Add to',
      template: '<div ng-controller="checkedCtrl"><ion-checkbox ng-model="data22.watched" ng-click="checked1(2)">Watched</ion-checkbox>'+
      '<ion-checkbox ng-model="data11.wanted" ng-click="checked1(1)">Wanted</ion-checkbox>'+
      '<ion-checkbox ng-model="data33.owned" ng-click="checked1(3)">Owned</ion-checkbox></div>',   
      okText: 'Add'
    });
    localStorage.setItem("popup", false);
    confirmPopup1.then(function(res)
    {
      console.log("confirmPopup1 homeCTRL");
      if(res)
      {
        console.log("RES!");
        if(localStorage.getItem("checkwanted") == "true")
        {
         console.log("saving wanted");
          //****
          var Title = inCinemaFims.title;
          var Poster = inCinemaFims.urlPoster;
          var Year = inCinemaFims.year;
          var Plot = inCinemaFims.simplePlot;
          console.log(Title);
          console.log(Poster);
          var jsonobj = {'Title' : Title, 'Poster' : Poster, 'Year': Year, 'Plot': Plot};
          //****
          var test1 = JSON.stringify(jsonobj);
          localStorage.setItem("speichern", true);
          var oldwanted = JSON.parse(localStorage["wanted"]) || [];
          console.log("oldwanted" + oldwanted.Title);
          console.log("test1 " + test1.Title);
          //var newwanted = JSON.stringify(inCinemaFims);
          var newwanted = test1;
          console.log("newwanted test with new object:");
          console.log(JSON.parse(newwanted).Title);
          console.log("newwanted");
          //console.log(JSON.parse(newwanted).Title);
          //oldwanted.push(newwanted);
          //Parsing-mania
          //Why does this bullshit even work???
          oldwanted.push(newwanted);
          localStorage["wanted"] = JSON.stringify(oldwanted);
         
          localStorage.setItem("wantedcount", parseInt(localStorage.getItem("wantedcount"))+1);
          console.log(localStorage.getItem("wantedcount"));
         
        }
          
         if(localStorage.getItem("checkwatched") == "true")
        {   
          localStorage.setItem("speichern", true);
          var Title = inCinemaFims.title;
          var Poster = inCinemaFims.urlPoster;
          var Year = inCinemaFims.year;
          var Plot = inCinemaFims.simplePlot;
           var jsonobj = {'Title' : Title, 'Poster' : Poster, 'Year': Year, 'Plot': Plot};
           var test1 = JSON.stringify(jsonobj);
          var oldwatched = JSON.parse(localStorage["watched"]) || [];
           var newwatched = test1;
         // var newwatched = JSON.stringify(inCinemaFims);
         console.log(newwatched);
          console.log(JSON.parse(newwatched).title);
          oldwatched.push(newwatched);
          localStorage["watched"] = JSON.stringify(oldwatched);
         
          localStorage.setItem("watchedcount", parseInt(localStorage.getItem("watchedcount"))+1);
         
          
          console.log("saving watched");
        }
        
        
        
         if(localStorage.getItem("checkowned") == "true")
        {
          console.log("saving owned");
          localStorage.setItem("speichern", true);
          var Title = inCinemaFims.title;
          var Poster = inCinemaFims.urlPoster;
          var Year = inCinemaFims.year;
          var Plot = inCinemaFims.simplePlot;
           var jsonobj = {'Title' : Title, 'Poster' : Poster, 'Year': Year, 'Plot': Plot};
           var test1 = JSON.stringify(jsonobj);
          var oldowned = JSON.parse(localStorage["owned"]) || [];
         // var newowned = JSON.stringify(inCinemaFims);
         var newowned = test1;
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
      var title = mov.Title;
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
   
   
.controller('checkedCtrl', function($scope, $ionicLoading, $state, $ionicPopup, HttpService, filmData)
{
  console.log("checkedCtrl");
  
  $scope.checked1 = function(id)
    {
      console.log("checked1 homeCTRL");
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
}
)  
      
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
              //wantedFilms[i] = holder;
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
 
 .controller('settingsCtrl', function($scope)
 {
   console.log("settingsCtrl");
   
   $scope.deleteLists = function(){
     console.log("deleting stuff");
     localStorage.setItem("speichern", false)
     var wanted = new Array();
      localStorage.setItem("wantedcount",0);
      localStorage["wanted"] = JSON.stringify(wanted);
    
      var watched = new Array();
      localStorage.setItem("watchedcount",0);
      localStorage["watched"] = JSON.stringify(watched);
    
      var owned = new Array();
      localStorage.setItem("ownedcount",0);
      localStorage["owned"] = JSON.stringify(owned);
     
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