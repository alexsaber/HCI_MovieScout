angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])


.service('savedwatched', function() {
 return {
   watchedM: [],
   getWatchedM: function() {
     return this.watchedM;
   },
   setWatchedM: function(watchedM) {
     this.watchedM = watchedM;
   }
 }
})

.service('movies', function()
{
  return JSON.parse(localStorage["wanted"]);
  //return localStorage["wanted"];
})



.service('filmData', function() {
 return {
   film: {},
   getFilm: function() {
     return this.film;
   },
   setFilm: function(film) {
     
    if(typeof film.Title === 'undefined'){
      console.log('film.Title is undefined');
      var convertedFilm = {
        Title: film.title,
        Year: film.year,
        Plot: film.simplePlot,
        Poster: film.urlPoster,
        Actors: 'NA'
      }

      this.film = convertedFilm;
    }
    else
      this.film = film;
   }
 }
})

.service('foundFilmsData', function() {
 return {
   foundFilms: [],
   getFoundFilms: function() {
     return this.foundFilms;
   },
   setFoundFilms: function(foundFilms) {
     this.foundFilms = foundFilms;
   }
 }
})


.service('inCinemasData', function() {
 return {
   inCinemaFilms: [],
   getInCinemaFilms: function() {
     return this.foundFilms;
   },
   setInCinemaFilms: function(inCinemaFilms) {
     this.inCinemaFilms = inCinemaFilms;
   }
 }
})

.service('HttpService', function($http) {
 return {
   searchFilms: function(title, year, type) {
     return $http.get('http://www.omdbapi.com/?s=' + title + '&y=' + year + '&type=' + type)
       .then(function (response) {
         console.log('Get Post', response);
         return response.data;
       });
   },
   searchIMDB : function(imdbID) {
     return $http.get('http://www.omdbapi.com/?i=' + imdbID)
       .then(function (response) {
         console.log('Get Post', response);
         return response.data;
       });
   },
   getInCinema : function() {
     return $http.get('http://www.myapifilms.com/imdb/inTheaters?token=dfd6b103-d4cc-440c-be6b-e66309d5d67e&format=json&language=en-us')
       .then(function (response) {
         console.log('Get Post', response);
         return response.data;
       });
   }
 };
});