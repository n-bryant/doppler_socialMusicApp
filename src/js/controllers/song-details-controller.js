(function() {
  angular.module('dopplerApp').controller('songDetailsController', function($stateParams, $q, SongsService, UserService) {
    this.currentUser = UserService.getCurrUser();

    const songId = $stateParams.id;
    console.log(songId);
    this.playing = false;

    // getting song data by id
    $q.when(SongsService.getSongs()).then((response) => {
      const allSongs = response.data.tracks;
      allSongs.forEach((song) => {
        if (song.id === songId) {
          this.song = song;
        }
      });

      this.hasSong = UserService.userHasSong(this.currentUser, this.song);
    }).catch((error) => {
      console.log(error);
    });

    this.toggleSaveSong = function(user, song) {
      UserService.toggleSong(user, song);
    }

    this.play = function(source) {
      this.track = new Audio(source);
      this.track.play();
    }

    this.pause = function(source) {
      this.track.pause();
    }

    this.userLogOut = function() {
      UserService.logOut(this.currentUser);
    };
  });
})();
