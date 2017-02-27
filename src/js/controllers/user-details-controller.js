(function() {
  angular.module('dopplerApp').controller('userDetailsController', function($stateParams, UserService, StorageService) {
    const userId = $stateParams.id;

    this.currentUser = UserService.getCurrUser();
    this.userToDisplay = UserService.userById(StorageService.get('all-users'), parseInt(userId, 10));
    this.friendSongs = this.userToDisplay.songs;
    console.log(this.userToDisplay);

    this.hasFriend = UserService.userHasFriend(this.currentUser, this.userToDisplay);
    this.toggleAddFriend = function() {
      UserService.toggleFriend(this.currentUser, this.userToDisplay);
    }

    this.userLogOut = function() {
      UserService.logOut(this.currentUser);
    }
  });
})();
