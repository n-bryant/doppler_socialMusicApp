(function() {
  angular.module('dopplerApp').controller('welcomeController', function($scope, $q, UserService, StorageService) {
    // bring in most recent user information
    $scope.currentUser = UserService.getCurrUser();
    $scope.currentUserFriends = $scope.currentUser.friends;
    $scope.userFriendCount = $scope.currentUserFriends.length;
    $scope.onlineFriends = [];
    $scope.offlineFriends = [];

    $scope.allUsers = StorageService.get('all-users');
    let currUserIndex = $scope.allUsers.indexOf($scope.currentUser);
    $scope.allUsers.splice(currUserIndex, 1);

    // get list of user's friends by id
    for (let i = 0; i < $scope.allUsers.length; i++) {
      if ($scope.currentUserFriends.indexOf($scope.allUsers[i].id) !== -1 && $scope.allUsers[i].loggedIn) {
        $scope.onlineFriends.push($scope.allUsers[i]);
      } else if ($scope.currentUserFriends.indexOf($scope.allUsers[i].id) !== -1 && !$scope.allUsers[i].loggedIn) {
        $scope.offlineFriends.push($scope.allUsers[i]);
      }
    }

    $scope.userLogOut = function() {
      UserService.logOut($scope.currentUser);
    };
  });
})();
