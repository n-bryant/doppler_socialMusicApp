(function() {
  angular.module('dopplerApp').controller('welcomeController', function($q, UserService, StorageService) {
    // bring in most recent user information
    this.currentUser = UserService.getCurrUser();

    this.userFriendCount = this.currentUser.friends.length;
    this.userSongCount = this.currentUser.songs.length;
    this.onlineFriends = UserService.getOnlineList(this.currentUser.friends, true);
    this.offlineFriends = UserService.getOnlineList(this.currentUser.friends, false);

    this.userLogOut = function() {
      UserService.logOut(this.currentUser);
    };
  });
})();
