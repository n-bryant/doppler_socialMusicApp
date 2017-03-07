(function() {
  angular.module('dopplerApp').controller('userDetailsController', function($q, $scope, $stateParams, UserService, SongsService, StorageService) {
    const userId = $stateParams.id;

    $scope.currentUser = UserService.getCurrUser();
    $scope.currentUserFriends = $scope.currentUser.friends;
    $scope.userToDisplay = UserService.userById(StorageService.get('all-users'), parseInt(userId, 10));
    $scope.userToDisplaySongs = $scope.userToDisplay.songs;
    $scope.friendTracks = [];

    $q.when(SongsService.getSongs()).then((response) => {
      $scope.allSongs = response.data.tracks;
      for (let i = 0; i < $scope.allSongs.length; i++) {
        if ($scope.userToDisplaySongs.indexOf($scope.allSongs[i].id) !== -1) {
          $scope.friendTracks.push($scope.allSongs[i]);
        }
      }
    }).catch((error) => {
      console.log(error);
    });
    console.log($scope.userToDisplay);

    $scope.toggleAddFriend = function(user, friendId) {
      UserService.toggleFriend(user, friendId);
    }

    $scope.userLogOut = function() {
      UserService.logOut($scope.currentUser);
    }
  });
})();
