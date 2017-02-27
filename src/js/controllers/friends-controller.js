(function() {
  angular.module('dopplerApp').controller('friendsController', function(UserService, StorageService) {
    this.currentUser = UserService.getCurrUser();

    // sets list of other users aside from the current user
    this.allUsers = StorageService.get('all-users');
    let currUserIndex = this.allUsers.indexOf(this.currentUser);
    this.allUsers.splice(currUserIndex, 1);

    this.toggleAddFriend = function(user, friend) {
      UserService.toggleFriend(user, friend);
    };

    this.userLogOut = function() {
      UserService.logOut(this.currentUser);
    };
  });
})();
