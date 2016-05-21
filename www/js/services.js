angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])


.service('filmData', function() {
 return {
   film: {},
   getFilm: function() {
     return this.film;
   },
   setFilm: function(film) {
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
 };
});