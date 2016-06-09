angular.module('app.controllers', [])

.controller('MenuCtrl', function ($scope) {
    $scope.barcode = function () {
        cordova.plugins.barcodeScanner.scan
          (
             function (result) {
                 alert("We got a barcode\n" +
                       "Result: " + result.text + "\n" +
                       "Format: " + result.format + "\n" +
                       "Cancelled: " + result.cancelled);
             },
             function (error) {
                 alert("Scanning failed: " + error);
             },
             {
                 "preferFrontCamera": false, // iOS and Android
                 "showFlipCameraButton": true, // iOS and Android
                 "prompt": "Place a barcode inside the scan area", // supported on Android only
                 "formats": "QR_CODE,PDF_417,EAN-8, UPC-E, UPC-E, UPC-E, UPC-E, EAN-13, UPC-A, RSS_EXPANDED", // default: all but PDF_417 and RSS_EXPANDED
                 "orientation": "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
             }
          )
    }
})

.controller('homeCtrl', function($scope, $ionicLoading, $state, $ionicPopup, HttpService, filmData) {
 
    $ionicLoading.show({
        template: '<img ng-src="img/logo_big.png"><br>Loading...',
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 1500,
        showDelay: 0
    });


    $scope.gts = function () {$state.go("menu.globalSrch");};

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
  
  HttpService.getInCinema().then(function(searchFilmsRspns) {  
    var inCinemaFims = searchFilmsRspns.data.inTheaters[1].movies;//inTheatersNow: "In Theaters Now"
    console.log(inCinemaFims);
    $ionicLoading.hide();
    $scope.filmsInCinemas = inCinemaFims;
  });
  

  $scope.addToList = function (inCinemaFims) {

      var isInWanted = false;
      var len = parseInt(localStorage.getItem("wantedcount"));
      for (i = 0; i < len; i++) {
          var holder = JSON.parse(localStorage["wanted"])[i];
          var holder2 = JSON.parse(holder);
          if (inCinemaFims.idIMDB == holder2.imdbID) {
              isInWanted = true;
              break;
          }
      }

      var isInwatched = false;
      len = parseInt(localStorage.getItem("watchedcount"));
      for (i = 0; i < len; i++) {
          var holder = JSON.parse(localStorage["watched"])[i];
          var holder2 = JSON.parse(holder);
          if (inCinemaFims.idIMDB == holder2.imdbID) {
              isInwatched = true;
              break;
          }
      }

      var isInOwned = false;
      len = parseInt(localStorage.getItem("ownedcount"));
      for (i = 0; i < len; i++) {
          var holder = JSON.parse(localStorage["owned"])[i];
          var holder2 = JSON.parse(holder);

          if (inCinemaFims.idIMDB == holder2.imdbID) {
              isInOwned = true;
              break;
          }
      }

      $scope.data11 = { wanted: isInWanted };
      $scope.data22 = { watched: isInwatched };
      $scope.data33 = { owned: isInOwned };

      localStorage.setItem("checkwanted", isInWanted);
      localStorage.setItem("checkwatched", isInwatched);
      localStorage.setItem("checkowned", isInOwned);
      localStorage.setItem("popup", true);

      filmData.setFilm(inCinemaFims);
      //Popup - Add to which lists?
      var confirmPopup1 = $ionicPopup.confirm({
          title: 'Manage Lists',
          template: '<div ng-controller="checkedCtrl"><ion-checkbox  ng-checked="' + isInwatched + '" ng-model="data22.watched" ng-click="checked1(2)">Watched</ion-checkbox>' +
          '<ion-checkbox ng-checked="' + isInWanted + '" ng-model="data11.wanted" ng-click="checked1(1)">Wanted</ion-checkbox>' +
          '<ion-checkbox ng-checked="' + isInOwned + '" ng-model="data33.owned" ng-click="checked1(3)">Owned</ion-checkbox></div>',
          okText: 'Update'
      });

      localStorage.setItem("popup", false);


      confirmPopup1.then(function (res) {
          if (res) {
              if (localStorage.getItem("checkwanted") == "true" && !isInWanted) //Movie will be added to Wanted
              {
                  console.log("saving wanted");
                  //As 2 different APIs are used, a custom JSON object is created so that the Objects
                  //of both APIs have the same attributes with the same variable names.
                  var Title = inCinemaFims.title;
                  var Poster = inCinemaFims.urlPoster;
                  var Year = inCinemaFims.year;
                  var Plot = inCinemaFims.simplePlot;
                  console.log(Title);
                  console.log(Poster);
                  var IMDB = inCinemaFims.idIMDB;
                  var jsonobj = { 'Title': Title, 'Poster': Poster, 'Year': Year, 'Plot': Plot, 'imdbID': IMDB };

                  //Parsing-mania
                  var newJSON = JSON.stringify(jsonobj);
                  localStorage.setItem("speichern", true);
                  var oldwanted = JSON.parse(localStorage["wanted"]) || [];

                  var newwanted = newJSON;

                  oldwanted.push(newwanted); //Add to Array
                  localStorage["wanted"] = JSON.stringify(oldwanted); //Save Array in a localStorage

                  localStorage.setItem("wantedcount", parseInt(localStorage.getItem("wantedcount")) + 1);
                  console.log(localStorage.getItem("wantedcount"));

              }
              else if (isInWanted && localStorage.getItem("checkwanted") == "false") {
                  var len = parseInt(localStorage.getItem("wantedcount"));

                  var old = JSON.parse(localStorage["wanted"]) || [];
                  for (i = 0; i < len; i++) {
                      //parsingmania
                      var holder = JSON.parse(localStorage["wanted"])[i];
                      var holder2 = JSON.parse(holder);
                      if (inCinemaFims.idIMDB == holder2.imdbID) {
                          old.splice(i, 1); //Delete movie from array
                      }

                  }
                  localStorage["wanted"] = JSON.stringify(old);
                  localStorage.setItem("wantedcount", parseInt(localStorage.getItem("wantedcount")) - 1);
                  //$scope.reload();
              }

              if (localStorage.getItem("checkwatched") == "true" && !isInwatched) //Movie will be saved to Wanted list
              {
                  //As 2 different APIs are used, a custom JSON object is created so that the Objects
                  //of both APIs have the same attributes with the same variable names.
                  var Title = inCinemaFims.title;
                  var Poster = inCinemaFims.urlPoster;
                  var Year = inCinemaFims.year;
                  var Plot = inCinemaFims.simplePlot;
                  var IMDB = inCinemaFims.idIMDB;
                  var jsonobj = { 'Title': Title, 'Poster': Poster, 'Year': Year, 'Plot': Plot, 'imdbID': IMDB };
                  var newJSON = JSON.stringify(jsonobj);
                  var oldwatched = JSON.parse(localStorage["watched"]) || [];
                  var newwatched = newJSON;

                  oldwatched.push(newwatched); //Add to Array
                  localStorage["watched"] = JSON.stringify(oldwatched); //Save Array in a localStorage

                  localStorage.setItem("watchedcount", parseInt(localStorage.getItem("watchedcount")) + 1);

                  console.log("saving watched");
              }
              else if (isInwatched && localStorage.getItem("checkwatched") == "false") {
                  var len = parseInt(localStorage.getItem("watchedcount"));

                  var old = JSON.parse(localStorage["watched"]) || [];
                  for (i = 0; i < len; i++) {
                      var holder = JSON.parse(localStorage["watched"])[i];
                      var holder2 = JSON.parse(holder);

                      if (inCinemaFims.idIMDB == holder2.imdbID) {
                          old.splice(i, 1);
                      }

                  }

                  localStorage["watched"] = JSON.stringify(old);
                  localStorage.setItem("watchedcount", parseInt(localStorage.getItem("watchedcount")) - 1);

                  //$scope.reload();
              }



              if (localStorage.getItem("checkowned") == "true" && !isInOwned) {
                  console.log("saving owned");
                  localStorage.setItem("speichern", true);
                  //As 2 different APIs are used, a custom JSON object is created so that the Objects
                  //of both APIs have the same attributes with the same variable names.
                  var Title = inCinemaFims.title;
                  var Poster = inCinemaFims.urlPoster;
                  var Year = inCinemaFims.year;
                  var Plot = inCinemaFims.simplePlot;
                  var IMDB = inCinemaFims.idIMDB;
                  var jsonobj = { 'Title': Title, 'Poster': Poster, 'Year': Year, 'Plot': Plot, 'imdbID': IMDB };
                  var newJSON = JSON.stringify(jsonobj);
                  var oldowned = JSON.parse(localStorage["owned"]) || [];

                  var newowned = newJSON;

                  oldowned.push(newowned);
                  localStorage["owned"] = JSON.stringify(oldowned);

                  localStorage.setItem("ownedcount", parseInt(localStorage.getItem("ownedcount")) + 1);
                  //$scope.reload();

              }
              else if (isInOwned && localStorage.getItem("checkowned") == "false") {
                  var len = parseInt(localStorage.getItem("ownedcount"));

                  var old = JSON.parse(localStorage["owned"]) || [];
                  for (i = 0; i < len; i++) {
                      //parsingmania
                      var holder = JSON.parse(localStorage["owned"])[i];
                      var holder2 = JSON.parse(holder);
                      if (inCinemaFims.idIMDB == holder2.imdbID) {
                          old.splice(i, 1);
                      }

                  }

                  localStorage["owned"] = JSON.stringify(old);
                  localStorage.setItem("ownedcount", parseInt(localStorage.getItem("ownedcount")) - 1);
                  //$scope.reload();
              }

              localStorage.setItem("checkwanted", false);
              localStorage.setItem("checkwatched", false);
              localStorage.setItem("checkowned", false);
          }
      })
  }
  
   
  
  
  $scope.goToMovieDescr = function (film) {

    
      console.log('goToMovieDescr for film: ' + film);
      var videoURL = film.trailer.videoURL;
      console.log('videoURL is:' + videoURL);
      if(typeof videoURL !== 'undefined'){
          console.log('videoURL is:' + videoURL);
          var videoURLFiltered = videoURL.replace("www", "m").replace("comVIDEO", "com/video");
          console.log('videoURLFiltered is:' + videoURLFiltered);
          film.trailer.videoURL = videoURLFiltered;
        }else
          console.log('videoURL was NOT found');
      
      
      filmData.setFilm(film);
      
      $state.go('menu.moviedescription');
    
    /*
      $ionicLoading.show({
          template: 'Loading...'
      });
      
      console.log('goToMovieDescr for film: ' + film);
      
      HttpService.getTrailer_MyAPIFilms(film.idIMDB).then(function(searchRspns) {  
        var videoURL = searchRspns.data.movies[0].trailer.videoURL;
        console.log('videoURL is:' + videoURL);
        if(typeof videoURL !== 'undefined'){
          console.log('videoURL is:' + videoURL);
          
          var videoURLFiltered = videoURL.replace("www", "m").replace("comVIDEO", "com/video");
          console.log('videoURLFiltered is:' + videoURLFiltered);
          film.videoURL = videoURLFiltered;
        }else
          console.log('videoURL NOT found');
          
        filmData.setFilm(film);
        $ionicLoading.hide();
        $state.go('menu.moviedescription');
      });
      */
  };
})
   
   
.controller('moviedescriptionCtrl', function($scope, filmData) {
  console.log('entered moviedescriptionCtrl ');
  $scope.film = filmData.getFilm();
  
  $scope.openTrailer = function(link){
  // Open in external browser
   console.log('entered openTrailer ');
  window.open(link, '_blank', 'location=no');
  };

  $scope.addToCalendar = function () {

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
  
  $scope.foundFilms = foundFilmsData.getFoundFilms();
  $ionicLoading.hide();

  $scope.addToCalendar = function (movie) {

      var title = movie.Title;
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
  
  $scope.addToWanted = function (film) {  //Saving movie to a List 
      //console.log('film is asdasdad' + film);

      var isInWanted = false;
      var len = parseInt(localStorage.getItem("wantedcount"));
      for (i = 0; i < len; i++) {
          var holder = JSON.parse(localStorage["wanted"])[i];
          var holder2 = JSON.parse(holder);
          if (film.imdbID == holder2.imdbID) {
              isInWanted = true;
              break;
          }
      }

      var isInwatched = false;
      len = parseInt(localStorage.getItem("watchedcount"));
      for (i = 0; i < len; i++) {
          var holder = JSON.parse(localStorage["watched"])[i];
          var holder2 = JSON.parse(holder);
          if (film.imdbID == holder2.imdbID) {
              isInwatched = true;
              break;
          }
      }

      var isInOwned = false;
      len = parseInt(localStorage.getItem("ownedcount"));
      for (i = 0; i < len; i++) {
          var holder = JSON.parse(localStorage["owned"])[i];
          var holder2 = JSON.parse(holder);
          if (film.imdbID == holder2.imdbID) {
              isInOwned = true;
              break;
          }
      }


      $scope.data1 = { wanted: isInWanted };
      $scope.data2 = { watched: isInwatched };
      $scope.data3 = { owned: isInOwned };

      localStorage.setItem("checkwanted", isInWanted);
      localStorage.setItem("checkwatched", isInwatched);
      localStorage.setItem("checkowned", isInOwned);
      localStorage.setItem("popup", true);


      filmData.setFilm(film);

      var confirmPopup = $ionicPopup.confirm({
          title: 'Manage Lists',
          template: '<div ng-controller="checkedCtrl"><ion-checkbox  ng-checked="' + isInwatched + '" ng-model="data2.watched" ng-click="checked1(2)">Watched</ion-checkbox>' +
          '<ion-checkbox ng-checked="' + isInWanted + '" ng-model="data1.wanted" ng-click="checked1(1)">Wanted</ion-checkbox>' +
          '<ion-checkbox ng-checked="' + isInOwned + '" ng-model="data3.owned" ng-click="checked1(3)">Owned</ion-checkbox></div>',
          okText: 'Update'
      });

      localStorage.setItem("popup", false);

      confirmPopup.then(function (res) {
          if (res) {
              if (localStorage.getItem("checkwanted") == "true" && !isInWanted) {
                  localStorage.setItem("speichern", true);
                  var oldwanted = JSON.parse(localStorage["wanted"]) || [];
                  var newwanted = JSON.stringify(film);

                  oldwanted.push(newwanted);
                  localStorage["wanted"] = JSON.stringify(oldwanted);

                  localStorage.setItem("wantedcount", parseInt(localStorage.getItem("wantedcount")) + 1);

              }
              else {
                  if (isInWanted && localStorage.getItem("checkwanted") == "false") {
                      var len = parseInt(localStorage.getItem("wantedcount"));

                      var old = JSON.parse(localStorage["wanted"]) || [];
                      for (i = 0; i < len; i++) {
                          //parsingmania
                          var holder = JSON.parse(localStorage["wanted"])[i];
                          var holder2 = JSON.parse(holder);
                          if (film.imdbID == holder2.imdbID) {
                              old.splice(i, 1); //Delete movie from array
                          }

                      }
                      localStorage["wanted"] = JSON.stringify(old);
                      localStorage.setItem("wantedcount", parseInt(localStorage.getItem("wantedcount")) - 1);

                      //  if (listId==0)
                      $scope.reload();
                  }
              }

              if (localStorage.getItem("checkwatched") == "true" && !isInwatched) {
                  localStorage.setItem("speichern", true);

                  var oldwatched = JSON.parse(localStorage["watched"]) || [];
                  var newwatched = JSON.stringify(film);

                  oldwatched.push(newwatched);
                  localStorage["watched"] = JSON.stringify(oldwatched);

                  localStorage.setItem("watchedcount", parseInt(localStorage.getItem("watchedcount")) + 1);

              }
              else if (isInwatched && localStorage.getItem("checkwatched") == "false") {
                  var len = parseInt(localStorage.getItem("watchedcount"));

                  var old = JSON.parse(localStorage["watched"]) || [];
                  for (i = 0; i < len; i++) {
                      var holder = JSON.parse(localStorage["watched"])[i];
                      var holder2 = JSON.parse(holder);

                      if (film.imdbID == holder2.imdbID) {
                          old.splice(i, 1);
                      }

                  }

                  localStorage["watched"] = JSON.stringify(old);
                  localStorage.setItem("watchedcount", parseInt(localStorage.getItem("watchedcount")) - 1);

                  //  if (listId == 1)
                  $scope.reload();
              }



              if (localStorage.getItem("checkowned") == "true" && !isInOwned) {
                  localStorage.setItem("speichern", true);

                  var oldowned = JSON.parse(localStorage["owned"]) || [];
                  var newowned = JSON.stringify(film);

                  oldowned.push(newowned);
                  localStorage["owned"] = JSON.stringify(oldowned);

                  localStorage.setItem("ownedcount", parseInt(localStorage.getItem("ownedcount")) + 1);
              }
              else if (isInOwned && localStorage.getItem("checkowned") == "false") {
                  var len = parseInt(localStorage.getItem("ownedcount"));

                  var old = JSON.parse(localStorage["owned"]) || [];
                  for (i = 0; i < len; i++) {
                      //parsingmania
                      var holder = JSON.parse(localStorage["owned"])[i];
                      var holder2 = JSON.parse(holder);
                      if (film.imdbID == holder2.imdbID) {
                          old.splice(i, 1);
                      }

                  }

                  localStorage["owned"] = JSON.stringify(old);
                  localStorage.setItem("ownedcount", parseInt(localStorage.getItem("ownedcount")) - 1);

                  // if (listId == 2)
                  $scope.reload();
              }

              localStorage.setItem("checkwanted", false);
              localStorage.setItem("checkwatched", false);
              localStorage.setItem("checkowned", false);
          }
      })
  }
  
   $scope.checked = function(id)  //See if checkbos has been checked
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
       if(id == 1)
       {
            if(localStorage.getItem("checkwanted") == "false")
            {
              localStorage.setItem("checkwanted", true);
            }
            else
            {
              localStorage.setItem("checkwanted", false);
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
})  
      
.controller('wantedCtrl', function($scope, $state, filmData) {
  
    console.log("wanted controller");
    $scope.gts = function () { $state.go("menu.globalSrch"); };
     
        $scope.reload = function()
        {
              //thx to http://stackoverflow.com/a/23609343 
              $state.go($state.current, {}, {reload: true});
        }
     
        $scope.removeFromList = function(film)
        {
          var len = parseInt(localStorage.getItem("wantedcount"));
       
          var old = JSON.parse(localStorage["wanted"]) || [];
          for(i = 0; i < len; i++)
          {
            //parsingmania
            var holder = JSON.parse(localStorage["wanted"])[i];
            var holder2 = JSON.parse(holder);
            if(film.imdbID == holder2.imdbID)
            {
                old.splice(i,1); //Delete movie from array
            }
           
          }
           localStorage["wanted"] = JSON.stringify(old);
           localStorage.setItem("wantedcount", parseInt(localStorage.getItem("wantedcount"))-1);
           $scope.reload();   //reload page to see changes
        }
     
         $scope.showelements = function()
         {
            var len = parseInt(localStorage.getItem("wantedcount"));
            var wantedFilms = new Array();
            for(i = 0; i < len; i++)
            {
              var holder = JSON.parse(localStorage["wanted"])[i];
              var holder2 = JSON.parse(holder);
              wantedFilms[i] = holder2; 
            }
            $scope.wantedFilms = wantedFilms;
         }
              
         $scope.showelements();
         
         $scope.goToMovieDescr = function(film)
         {
            console.log('film is ' + film);
            filmData.setFilm(film);
            $state.go('menu.moviedescription');
        }  
       
  
})
      
.controller('globalSrchCtrl', function($scope, $q, $state, $ionicLoading, HttpService, filmData, foundFilmsData) {
  console.log("globalSrchCtrl");
  $scope.inputvalue = "";
  $scope.search = function() {
    
      if (document.getElementById("searchTitle").value != "")
      {

          $ionicLoading.show({
              template: '<img ng-src="img/logo_big.png"><br>Loading...',
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 1500,
              showDelay: 0
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
                $scope.films[counter].Rating = data.imdbRating;
                counter++;
              });

              var sort_by = function (field, reverse, primer) {

                  var key = primer ?
                      function (x) { return primer(x[field]) } :
                      function (x) { return x[field] };

                  reverse = !reverse ? 1 : -1;

                  return function (a, b) {
                      return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
                  }
              };

              if (counter > 0) { $scope.films.sort(sort_by('Year', true, parseInt)); }
                   

              //console.log('setting fondFilms: ' + $scope.films); 
              foundFilmsData.setFoundFilms($scope.films);
              $state.go('menu.globalSrchResults');
            });
           // console.log(' $scope.showFilms = $scope.films;'); 
        
          });
          //end of if
    }
    
  }; 
  

  }
})
 
 .controller('ownedCtrl', function($scope, $state, filmData) {
     console.log("owned controller");
     $scope.gts = function () { $state.go("menu.globalSrch"); };
    
     $scope.reload = function()
     {  //thx to http://stackoverflow.com/a/23609343 
        $state.go($state.current, {}, {reload: true});
     }
    
    $scope.removeFromList = function(film)
    {
          var len = parseInt(localStorage.getItem("ownedcount"));
       
          var old = JSON.parse(localStorage["owned"]) || [];
          for(i = 0; i < len; i++)
          {
              //parsingmania
              var holder = JSON.parse(localStorage["owned"])[i];
              var holder2 = JSON.parse(holder);
              if(film.imdbID == holder2.imdbID)
              { 
                  old.splice(i,1);
              }
           
          }
          
          localStorage["owned"] = JSON.stringify(old);
          localStorage.setItem("ownedcount", parseInt(localStorage.getItem("ownedcount"))-1);
          $scope.reload();
     }
    
    
    $scope.showelements = function()
    {     
          var len = parseInt(localStorage.getItem("ownedcount"));
          var ownedFilms = new Array();
          for(i = 0; i < len; i++)
          {
              var holder = JSON.parse(localStorage["owned"])[i];
              var holder2 = JSON.parse(holder);
              ownedFilms[i] = holder2;
          }
          
          $scope.ownedFilms = ownedFilms;
    }
              
    $scope.showelements();
         
    $scope.goToMovieDescr = function(film)
    {
     console.log('film is ' + film);
     filmData.setFilm(film);
     $state.go('menu.moviedescription');
   }  
 })
 
 .controller('settingsCtrl', function($scope)
 {
   console.log("settingsCtrl");

   $scope.deleteLists = function()
   {
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
 
 .controller('watchedpageCtrl', function($scope, $state, filmData)
 {
     console.log("watched controller");

     $scope.gts = function () { $state.go("menu.globalSrch"); };

     $scope.reload = function()
     {
        //thx to http://stackoverflow.com/a/23609343 
        $state.go($state.current, {}, {reload: true});
     }
           
     $scope.removeFromList = function(film)
     {
         var len = parseInt(localStorage.getItem("watchedcount"));
       
         var old = JSON.parse(localStorage["watched"]) || [];
         for(i = 0; i < len; i++)
         {
            var holder = JSON.parse(localStorage["watched"])[i];
            var holder2 = JSON.parse(holder);
           
            if(film.imdbID == holder2.imdbID)
            {
                old.splice(i,1);
            }
           
         }
         
         localStorage["watched"] = JSON.stringify(old);
         localStorage.setItem("watchedcount", parseInt(localStorage.getItem("watchedcount"))-1);
           
         $scope.reload();  
     }
     
     $scope.showelements = function()
     {
         var len = parseInt(localStorage.getItem("watchedcount"));
         var watchedFilms = new Array();
         for(i = 0; i < len; i++)
         {
              var holder = JSON.parse(localStorage["watched"])[i];
              var holder2 = JSON.parse(holder);
              watchedFilms[i] = holder2;
         }
         $scope.watchedFilms = watchedFilms;
          
     }
              
     $scope.showelements();
         
     $scope.goToMovieDescr = function(film)
     {
        console.log('film is ' + film);
        filmData.setFilm(film);
        $state.go('menu.moviedescription');
     }  
     
 });