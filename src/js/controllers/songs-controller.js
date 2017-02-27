(function() {
  angular.module('dopplerApp').controller('songsController', function($q, SongsService, UserService) {
    this.currentUser = UserService.getCurrUser();
    this.currentUserSongs = this.currentUser.songs;
    // ASK DAN ABOUT WHY ACTIVE CLASS ON SAVE BUTTON ISN'T SAVING ON PAGE REFRESH
    // console.log(this.currentUserSongs);

    this.orderByField = 'name';
    this.reverseSort = false;
    this.playing;
    this.currTrackSrc;

    $q.when(SongsService.getSongs()).then((response) => {
      this.allSongs = response.data.tracks;
    }).catch((error) => {
      console.log(error);
    });

    this.toggleSaveSong = function(user, song) {
      UserService.toggleSong(user, song);
    }

    this.play = function(source) {
      this.playing = true;
      if (this.currTrackSrc === source) {
        this.track.play();
      } else {
        this.currTrackSrc = source;
        this.track = new Audio(source);
        this.track.play();
      }
    }

    this.pause = function(source) {
      if (this.currTrackSrc === source) {
        this.track.pause();
      }
    }

    this.updateTable = function(column) {
      this.orderByField = column;
      this.reverseSort = !this.reverseSort;
    }

    this.userLogOut = function() {
      UserService.logOut(this.currentUser);
    };
  });
})();
