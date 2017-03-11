'use strict';

(function () {
  "use strict";

  angular.module('dopplerApp', ['ui.router', 'LocalStorageModule']);

  angular.module('dopplerApp').config(function ($stateProvider, $urlRouterProvider) {

    // default url path
    $urlRouterProvider.otherwise('/');

    // state declaration
    $stateProvider.state('DopplerParent', {
      url: '/',
      abstract: true,
      template: '<ui-view></ui-view>'
    }).state('DopplerParent.index', {
      url: '',
      controller: 'logInController as loginCtrl',
      templateUrl: './templates/login.html'
    }).state('DopplerParent.profile', {
      url: 'profile',
      controller: 'welcomeController as welcomeCtrl',
      templateUrl: './templates/welcome.html'
    }).state('DopplerParent.songs', {
      url: 'songs',
      controller: 'songsController as songsCtrl',
      templateUrl: './templates/songs.html'
    }).state('DopplerParent.friends', {
      url: 'friends',
      controller: 'friendsController as friendsCtrl',
      templateUrl: './templates/friends.html'
    }).state('DopplerParent.userDetails', {
      url: 'user-details/:id',
      templateUrl: './templates/user-details.html',
      controller: 'userDetailsController as userDetCtrl'
    }).state('DopplerParent.songDetails', {
      url: 'song-details/:id',
      templateUrl: './templates/song-details.html',
      controller: 'songDetailsController as songDetCtrl'
    });
  });
})();
'use strict';

(function () {
  angular.module('dopplerApp').controller('appController', function (UserService, StorageService) {
    this.section = null;

    this.updateSection = function (tab) {
      if (this.section === tab) return;
      this.section = tab;
    };
  });
})();
'use strict';

(function () {
  angular.module('dopplerApp').controller('friendsController', function ($scope, UserService, StorageService) {
    $scope.currentUser = UserService.getCurrUser();
    $scope.currentUserFriends = $scope.currentUser.friends;
    $scope.userFriends = [];

    // sets list of other users aside from the current user
    $scope.allUsers = StorageService.get('all-users');
    var currUserIndex = $scope.allUsers.indexOf($scope.currentUser);
    $scope.allUsers.splice(currUserIndex, 1);

    $scope.toggleAddFriend = function (user, friendId) {
      UserService.toggleFriend(user, friendId);
    };

    $scope.userLogOut = function () {
      UserService.logOut($scope.currentUser);
    };
  });
})();
'use strict';

(function () {
  angular.module('dopplerApp').controller('logInController', function ($state, $q, UserService, StorageService) {

    this.authenticate = function (username) {
      var _this = this;

      users = StorageService.get('all-users');

      $q.when(UserService.getUserData()).then(function (response) {
        var randI = Math.floor(Math.random() * response.data.results.length);
        var userData = response.data.results[randI];
        _this.newUser = UserService.newUser(username, userData);
        UserService.setCurrUser(_this.newUser);
        users.push(_this.newUser);
        StorageService.set('all-users', users);
        $state.go('DopplerParent.profile');
      }).catch(function (error) {
        console.log(error);
      });
    };
  });
})();
'use strict';

(function () {
  angular.module('dopplerApp').controller('songDetailsController', function ($stateParams, $scope, $q, SongsService, UserService) {
    $scope.currentUser = UserService.getCurrUser();
    $scope.currentUserSongs = $scope.currentUser.songs;
    $scope.userTracks = [];

    var songId = $stateParams.id;
    var playing = false;

    // get list of user's songs
    $q.when(SongsService.getSongs()).then(function (response) {
      $scope.allSongs = response.data.tracks;
      for (var i = 0; i < $scope.allSongs.length; i++) {
        if ($scope.currentUserSongs.indexOf($scope.allSongs[i].id) !== -1) {
          $scope.userTracks.push($scope.allSongs[i]);
        }
      }
    }).catch(function (error) {
      console.log(error);
    });

    // getting song data by id
    $q.when(SongsService.getSongs()).then(function (response) {
      var allSongs = response.data.tracks;
      allSongs.forEach(function (song) {
        if (song.id === songId) {
          $scope.song = song;
        }
      });
    }).catch(function (error) {
      console.log(error);
    });

    $scope.toggleSaveSong = function (user, songId) {
      UserService.toggleSong(user, songId);
    };

    $scope.play = function (source) {
      console.log(source);
      $scope.playing = true;
      $scope.track = new Audio(source);
      $scope.track.play();
    };

    $scope.pause = function (source) {
      $scope.playing = false;
      $scope.track.pause();
    };

    $scope.userLogOut = function () {
      UserService.logOut($scope.currentUser);
    };
  });
})();
'use strict';

(function () {
  angular.module('dopplerApp').controller('songsController', function ($scope, $q, SongsService, UserService) {
    $scope.currentUser = UserService.getCurrUser();
    $scope.currentUserSongs = $scope.currentUser.songs;
    $scope.userTracks = [];
    $scope.userTrackCount = null;

    $scope.orderByField = 'name';
    $scope.reverseSort = false;
    $scope.playing;
    $scope.currTrackSrc;

    // get list of user's songs
    $q.when(SongsService.getSongs()).then(function (response) {
      $scope.allSongs = response.data.tracks;
      for (var i = 0; i < $scope.allSongs.length; i++) {
        if ($scope.currentUserSongs.indexOf($scope.allSongs[i].id) !== -1) {
          $scope.userTracks.push($scope.allSongs[i]);
        }
      }
      $scope.userTrackCount = $scope.userTracks.length;
    }).catch(function (error) {
      console.log(error);
    });

    // toggle user's favoriting of song
    $scope.toggleSaveSong = function (user, songId) {
      var newUserTrackIds = UserService.toggleSong(user, songId);
      $scope.userTracks = [];
      for (var i = 0; i < $scope.allSongs.length; i++) {
        if (newUserTrackIds.indexOf($scope.allSongs[i].id) !== -1) {
          $scope.userTracks.push($scope.allSongs[i]);
        }
      }
      $scope.userTrackCount = $scope.userTracks.length;
      $scope.$watch(function (scope) {
        return scope.userTrackCount;
      }, function () {
        if (document.querySelector('.song-count')) {
          document.querySelector('.song-count').innerText = 'Number of favorited songs: ' + $scope.userTrackCount;
        }
      });
    };

    // play song
    $scope.play = function (source) {
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
    };

    // pause song
    $scope.pause = function (source) {
      $scope.track.pause();
      if ($scope.currTrackSrc !== source) {
        $scope.track = new Audio(source);
      }
    };

    // update sort
    $scope.updateTable = function (column) {
      $scope.orderByField = column;
      $scope.reverseSort = !$scope.reverseSort;
    };

    // log out current user
    $scope.userLogOut = function () {
      UserService.logOut($scope.currentUser);
    };
  });
})();
'use strict';

(function () {
  angular.module('dopplerApp').controller('userDetailsController', function ($q, $scope, $stateParams, UserService, SongsService, StorageService) {
    var userId = $stateParams.id;

    $scope.currentUser = UserService.getCurrUser();
    $scope.currentUserFriends = $scope.currentUser.friends;
    $scope.userToDisplay = UserService.userById(StorageService.get('all-users'), parseInt(userId, 10));
    $scope.userToDisplaySongs = $scope.userToDisplay.songs;
    $scope.friendTracks = [];

    $q.when(SongsService.getSongs()).then(function (response) {
      $scope.allSongs = response.data.tracks;
      for (var i = 0; i < $scope.allSongs.length; i++) {
        if ($scope.userToDisplaySongs.indexOf($scope.allSongs[i].id) !== -1) {
          $scope.friendTracks.push($scope.allSongs[i]);
        }
      }
    }).catch(function (error) {
      console.log(error);
    });
    console.log($scope.userToDisplay);

    $scope.toggleAddFriend = function (user, friendId) {
      UserService.toggleFriend(user, friendId);
    };

    $scope.userLogOut = function () {
      UserService.logOut($scope.currentUser);
    };
  });
})();
'use strict';

(function () {
  angular.module('dopplerApp').controller('welcomeController', function ($scope, $q, UserService, StorageService) {
    // bring in most recent user information
    $scope.currentUser = UserService.getCurrUser();
    $scope.currentUserFriends = $scope.currentUser.friends;
    $scope.userFriendCount = $scope.currentUserFriends.length;
    $scope.onlineFriends = [];
    $scope.offlineFriends = [];

    $scope.allUsers = StorageService.get('all-users');
    var currUserIndex = $scope.allUsers.indexOf($scope.currentUser);
    $scope.allUsers.splice(currUserIndex, 1);

    // get list of user's friends by id
    for (var i = 0; i < $scope.allUsers.length; i++) {
      if ($scope.currentUserFriends.indexOf($scope.allUsers[i].id) !== -1 && $scope.allUsers[i].loggedIn) {
        $scope.onlineFriends.push($scope.allUsers[i]);
      } else if ($scope.currentUserFriends.indexOf($scope.allUsers[i].id) !== -1 && !$scope.allUsers[i].loggedIn) {
        $scope.offlineFriends.push($scope.allUsers[i]);
      }
    }

    $scope.userLogOut = function () {
      UserService.logOut($scope.currentUser);
    };
  });
})();
'use strict';

(function () {
  angular.module('dopplerApp').service('StorageService', function (localStorageService) {
    function set(name, data) {
      localStorageService.set(name, data);
    }

    function get(name) {
      return localStorageService.get(name) || [];
    }

    return {
      get: get,
      set: set
    };
  });
})();
'use strict';

(function () {
  angular.module('dopplerApp').service('SongsService', function ($http) {
    function getAllSongs() {
      return $http({
        method: 'GET',
        url: './src/data/songs-data.json'
      });
    }

    return {
      getSongs: getAllSongs
    };
  });
})();
'use strict';

(function () {
  angular.module('dopplerApp').service('UserService', function ($http, $state, $q, StorageService) {
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

    // // returns an array of a user's logged in friend user objects
    // function getOnlineFriends(friendsList, online) {
    //   let onlineList = [];
    //   let offlineList = [];
    //
    //   friendsList.forEach((friend) => {
    //     if (friend.loggedIn) {
    //       onlineList.push(friend);
    //     } else {
    //       offlineList.push(friend);
    //     }
    //   });
    //
    //   return online ? onlineList : offlineList;
    // }

    // gets user by id
    function getUserById(userArray, id) {
      var userMatch = void 0;
      userArray.forEach(function (user) {
        if (user.id === id) {
          userMatch = user;
        }
      });
      return userMatch;
    }

    // sets a user to logged out and returns user to home page
    function logOutUser(user) {
      user.loggedIn = !user.loggedIn;
      var allUsers = StorageService.get('all-users');
      var userToUpdate = getUserById(allUsers, user.id);

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
      var user = {
        id: Date.now(),
        username: username,
        loggedIn: true,
        lastLoginDate: new Date(),
        friends: [],
        songs: [],
        avatar: data.picture.large,
        name: data.name.first + ' ' + data.name.last
      };

      return user;
    }

    // toggles a user's friend status
    function userToggleFriend(user, friendId) {
      if (user.friends.indexOf(friendId) === -1) {
        user.friends.push(friendId);
      } else {
        var index = user.friends.indexOf(friendId);
        user.friends.splice(index, 1);
      }

      var allUsers = StorageService.get('all-users');
      var userToUpdate = getUserById(allUsers, user.id);
      angular.copy(user, userToUpdate);
      StorageService.set('all-users', allUsers);
    }

    // toggles a user like on a song
    function userToggleSong(user, songId) {
      if (user.songs.indexOf(songId) === -1) {
        user.songs.push(songId);
      } else {
        var index = user.songs.indexOf(songId);
        user.songs.splice(index, 1);
      }

      var allUsers = StorageService.get('all-users');
      var userToUpdate = getUserById(allUsers, user.id);
      angular.copy(user, userToUpdate);
      StorageService.set('all-users', allUsers);

      return user.songs;
    }

    return {
      getCurrUser: getCurrentUser,
      setCurrUser: setCurrentUser,
      getUserData: getUserData,
      newUser: setNewUser,
      logOut: logOutUser,
      // getOnlineList: getOnlineFriends,
      toggleFriend: userToggleFriend,
      toggleSong: userToggleSong,
      userById: getUserById
    };
  });
})();