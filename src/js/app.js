(function() {
  "use strict";

  angular.module('dopplerApp', ['ui.router', 'LocalStorageModule']);

  angular.module('dopplerApp').config(function($stateProvider, $urlRouterProvider) {

    // default url path
    $urlRouterProvider.otherwise('/');

    // NEED TO FIX ACTIVE TAB CONFIGURATION
    // HAVE SONG 'MORE INFO' BUTTON AND USER 'AVATAR's LINK TO URLS WITH MORE DETAILS
    // state declaration
    $stateProvider.state('DopplerParent', {
      url: '/',
      abstract: true,
      template: '<ui-view></ui-view>'
    }).state('DopplerParent.index', {
      url: '',
      controller: 'logInController as loginCtrl',
      templateUrl: './templates/login.html'
    }).state('DopplerParent.profile', {
      url: 'profile',
      controller: 'welcomeController as welcomeCtrl',
      templateUrl: './templates/welcome.html',
      activeTab: 'home'
    }).state('DopplerParent.songs', {
      url: 'songs',
      controller: 'songsController as songsCtrl',
      templateUrl: './templates/songs.html',
      activeTab: 'songs'
    }).state('DopplerParent.friends', {
      url: 'friends',
      controller: 'friendsController as friendsCtrl',
      templateUrl: './templates/friends.html',
      activeTab: 'friends'
    }).state('DopplerParent.userDetails', {
      url: 'user-details/:id',
      templateUrl: './templates/user-details.html',
      controller: 'userDetailsController as userDetCtrl',
      activeTab: 'friends'
    }).state('DopplerParent.songDetails', {
      url: 'song-details/:id',
      templateUrl: './templates/song-details.html',
      controller: 'songDetailsController as songDetCtrl',
      activeTab: 'songs'
    });
  });
})();
