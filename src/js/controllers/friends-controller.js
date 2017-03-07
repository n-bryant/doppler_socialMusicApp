(function() {
  angular.module('dopplerApp').controller('friendsController', function($scope, UserService, StorageService) {
    $scope.currentUser = UserService.getCurrUser();
    $scope.currentUserFriends = $scope.currentUser.friends;
    $scope.userFriends = [];

    // sets list of other users aside from the current user
    $scope.allUsers = StorageService.get('all-users');
    let currUserIndex = $scope.allUsers.indexOf($scope.currentUser);
    $scope.allUsers.splice(currUserIndex, 1);

    $scope.toggleAddFriend = function(user, friendId) {
      UserService.toggleFriend(user, friendId);
    };

    $scope.userLogOut = function() {
      UserService.logOut($scope.currentUser);
    };
  });
})();
