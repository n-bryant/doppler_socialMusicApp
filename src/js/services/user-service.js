(function() {
  angular.module('dopplerApp').service('UserService', function($http, $state, $q, StorageService) {
    this.currentUser = {};

    // returns the currentUser
    function getCurrentUser() {
      this.currentUser = StorageService.get('all-users')[StorageService.get('all-users').length - 1];
      return this.currentUser;
    }

    // gets base set of user data from randomuser.me
    function getUserData() {
      return $http({
        method: 'GET',
        url: './src/data/randomuserme-data.json'
      });
    }

    // returns an array of a user's logged in friend user objects
    function getOnlineFriends(friendsList, online) {
      let onlineList = [];
      let offlineList = [];

      friendsList.forEach((friend) => {
        if (friend.loggedIn) {
          onlineList.push(friend);
        } else {
          offlineList.push(friend);
        }
      });

      return online ? onlineList : offlineList;
    }

    // gets user by id
    function getUserById(userArray, id) {
      let userMatch;
      userArray.forEach((user) => {
        if (user.id === id) {
          userMatch = user;
        }
      });
      return userMatch;
    }

    // sets a user to logged out and returns user to home page
    function logOutUser(user) {
      user.loggedIn = !user.loggedIn;
      let allUsers = StorageService.get('all-users');
      let userToUpdate = getUserById(allUsers, user.id);

      angular.copy(user, userToUpdate);
      StorageService.set('all-users', allUsers);
      $state.go('DopplerParent.index');
    }

    // sets the current user
    function setCurrentUser(user) {
      this.currentUser = user;
    }

    // builds a new user
    function setNewUser(username, data) {
      let user = {
        id: Date.now(),
        username: username,
        loggedIn: true,
        lastLoginDate: new Date(),
        friends: [],
        songs: [],
        avatar: data.picture.large,
        name: `${data.name.first} ${data.name.last}`
      }

      return user;
    }

    // checks if user has a friend
    function userHasFriend(user, friend) {
      for (let i = 0; i < user.friends.length; i++) {
        if (user.friends[i].id === friend.id) {
          return true;
        } else {
          return false;
        }
      }
    }

    // checks if user has a song
    function userHasSong(user, song) {
      for (let i = 0; i < user.songs.length; i++) {
        if (user.songs[i].name === song.name) {
          return true;
        } else {
          return false;
        }
      }
    }

    // toggles a user's friend status
    function userToggleFriend(user, friend) {
      if (user.friends.indexOf(friend) === -1) {
        user.friends.push(friend);
      } else {
        let index = user.friends.indexOf(friend);
        user.friends.splice(index, 1);
      }

      let allUsers = StorageService.get('all-users');
      let userToUpdate = getUserById(allUsers, user.id);
      angular.copy(user, userToUpdate);
      StorageService.set('all-users', allUsers);
    }

    // toggles a user like on a song
    function userToggleSong(user, song) {
      if (user.songs.indexOf(song) === -1) {
        user.songs.push(song);
      } else {
        let index = user.songs.indexOf(song);
        user.songs.splice(index, 1);
      }

      let allUsers = StorageService.get('all-users');
      let userToUpdate = getUserById(allUsers, user.id);
      angular.copy(user, userToUpdate);
      StorageService.set('all-users', allUsers);
    }

    return {
      getCurrUser: getCurrentUser,
      setCurrUser: setCurrentUser,
      getUserData: getUserData,
      newUser: setNewUser,
      logOut: logOutUser,
      getOnlineList: getOnlineFriends,
      toggleFriend: userToggleFriend,
      toggleSong: userToggleSong,
      userHasSong: userHasSong,
      userHasFriend: userHasFriend,
      userById: getUserById
    };
  });
})();
