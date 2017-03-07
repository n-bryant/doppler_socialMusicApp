(function() {
  angular.module('dopplerApp').controller('songsController', function($scope, $q, SongsService, UserService) {
    $scope.currentUser = UserService.getCurrUser();
    $scope.currentUserSongs = $scope.currentUser.songs;
    $scope.userTracks = [];
    $scope.userTrackCount = null;

    $scope.orderByField = 'name';
    $scope.reverseSort = false;
    $scope.playing;
    $scope.currTrackSrc;

    // get list of user's songs
    $q.when(SongsService.getSongs()).then((response) => {
      $scope.allSongs = response.data.tracks;
      for (let i = 0; i < $scope.allSongs.length; i++) {
        if ($scope.currentUserSongs.indexOf($scope.allSongs[i].id) !== -1) {
          $scope.userTracks.push($scope.allSongs[i]);
        }
      }
      $scope.userTrackCount = $scope.userTracks.length;
    }).catch((error) => {
      console.log(error);
    });

    // toggle user's favoriting of song
    $scope.toggleSaveSong = function(user, songId) {
      let newUserTrackIds = UserService.toggleSong(user, songId);
      $scope.userTracks = [];
      for (let i = 0; i < $scope.allSongs.length; i++) {
        if (newUserTrackIds.indexOf($scope.allSongs[i].id) !== -1) {
          $scope.userTracks.push($scope.allSongs[i]);
        }
      }
      $scope.userTrackCount = $scope.userTracks.length;
      $scope.$watch((scope) => { return scope.userTrackCount }, () => {
        if (document.querySelector('.song-count')) {
          document.querySelector('.song-count').innerText = `Number of favorited songs: ${$scope.userTrackCount}`;
        }
      });
    }

    // play song
    $scope.play = function(source) {
      if ($scope.track) {
        $scope.track.pause();
      }
      $scope.playing = true;
      if ($scope.currTrackSrc === source) {
        $scope.track.play();
      } else {
        $scope.currTrackSrc = source;
        $scope.track = new Audio(source);
        $scope.track.play();
      }
    }

    // pause song
    $scope.pause = function(source) {
      $scope.track.pause();
      if ($scope.currTrackSrc !== source) {
        $scope.track = new Audio(source);
      }
    }

    // update sort
    $scope.updateTable = function(column) {
      $scope.orderByField = column;
      $scope.reverseSort = !$scope.reverseSort;
    }

    // log out current user
    $scope.userLogOut = function() {
      UserService.logOut($scope.currentUser);
    };
  });
})();
