(function() {
  angular.module('dopplerApp').controller('songDetailsController', function($stateParams, $scope, $q, SongsService, UserService) {
    $scope.currentUser = UserService.getCurrUser();
    $scope.currentUserSongs = $scope.currentUser.songs;
    $scope.userTracks = [];

    const songId = $stateParams.id;
    let playing = false;

    // get list of user's songs
    $q.when(SongsService.getSongs()).then((response) => {
      $scope.allSongs = response.data.tracks;
      for (let i = 0; i < $scope.allSongs.length; i++) {
        if ($scope.currentUserSongs.indexOf($scope.allSongs[i].id) !== -1) {
          $scope.userTracks.push($scope.allSongs[i]);
        }
      }
    }).catch((error) => {
      console.log(error);
    });

    // getting song data by id
    $q.when(SongsService.getSongs()).then((response) => {
      const allSongs = response.data.tracks;
      allSongs.forEach((song) => {
        if (song.id === songId) {
          $scope.song = song;
        }
      });
    }).catch((error) => {
      console.log(error);
    });

    $scope.toggleSaveSong = function(user, songId) {
      UserService.toggleSong(user, songId);
    }

    $scope.play = function(source) {
      console.log(source);
      $scope.playing = true;
      $scope.track = new Audio(source);
      $scope.track.play();
    }

    $scope.pause = function(source) {
      $scope.playing = false;
      $scope.track.pause();
    }

    $scope.userLogOut = function() {
      UserService.logOut($scope.currentUser);
    };
  });
})();
