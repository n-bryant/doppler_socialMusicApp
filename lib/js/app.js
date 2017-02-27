'use strict';

(function () {
  "use strict";

  angular.module('dopplerApp', ['ui.router', 'LocalStorageModule']);

  angular.module('dopplerApp').config(function ($stateProvider, $urlRouterProvider) {

    // default url path
    $urlRouterProvider.otherwise('/');

    // NEED TO FIX ACTIVE TAB CONFIGURATION
    // HAVE SONG 'MORE INFO' BUTTON AND USER 'AVATAR's LINK TO URLS WITH MORE DETAILS
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
      templateUrl: './templates/welcome.html',
      activeTab: 'home'
    }).state('DopplerParent.songs', {
      url: 'songs',
      controller: 'songsController as songsCtrl',
      templateUrl: './templates/songs.html',
      activeTab: 'songs'
    }).state('DopplerParent.friends', {
      url: 'friends',
      controller: 'friendsController as friendsCtrl',
      templateUrl: './templates/friends.html',
      activeTab: 'friends'
    }).state('DopplerParent.userDetails', {
      url: 'user-details/:id',
      templateUrl: './templates/user-details.html',
      controller: 'userDetailsController as userDetCtrl',
      activeTab: 'friends'
    }).state('DopplerParent.songDetails', {
      url: 'song-details/:id',
      templateUrl: './templates/song-details.html',
      controller: 'songDetailsController as songDetCtrl',
      activeTab: 'songs'
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
  angular.module('dopplerApp').controller('friendsController', function (UserService, StorageService) {
    this.currentUser = UserService.getCurrUser();

    // sets list of other users aside from the current user
    this.allUsers = StorageService.get('all-users');
    var currUserIndex = this.allUsers.indexOf(this.currentUser);
    this.allUsers.splice(currUserIndex, 1);

    this.toggleAddFriend = function (user, friend) {
      UserService.toggleFriend(user, friend);
    };

    this.userLogOut = function () {
      UserService.logOut(this.currentUser);
    };
  });
})();
'use strict';

(function () {
  angular.module('dopplerApp').controller('logInController', function ($state, $q, UserService, StorageService) {
    var users = [];

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
  angular.module('dopplerApp').controller('songDetailsController', function ($stateParams, $q, SongsService, UserService) {
    var _this = this;

    this.currentUser = UserService.getCurrUser();

    var songId = $stateParams.id;
    console.log(songId);
    this.playing = false;

    // getting song data by id
    $q.when(SongsService.getSongs()).then(function (response) {
      var allSongs = response.data.tracks;
      allSongs.forEach(function (song) {
        if (song.id === songId) {
          _this.song = song;
        }
      });

      _this.hasSong = UserService.userHasSong(_this.currentUser, _this.song);
    }).catch(function (error) {
      console.log(error);
    });

    this.toggleSaveSong = function (user, song) {
      UserService.toggleSong(user, song);
    };

    this.play = function (source) {
      this.track = new Audio(source);
      this.track.play();
    };

    this.pause = function (source) {
      this.track.pause();
    };

    this.userLogOut = function () {
      UserService.logOut(this.currentUser);
    };
  });
})();
'use strict';

(function () {
  angular.module('dopplerApp').controller('songsController', function ($q, SongsService, UserService) {
    var _this = this;

    this.currentUser = UserService.getCurrUser();
    this.currentUserSongs = this.currentUser.songs;
    // ASK DAN ABOUT WHY ACTIVE CLASS ON SAVE BUTTON ISN'T SAVING ON PAGE REFRESH
    // console.log(this.currentUserSongs);

    this.orderByField = 'name';
    this.reverseSort = false;
    this.playing;
    this.currTrackSrc;

    $q.when(SongsService.getSongs()).then(function (response) {
      _this.allSongs = response.data.tracks;
    }).catch(function (error) {
      console.log(error);
    });

    this.toggleSaveSong = function (user, song) {
      UserService.toggleSong(user, song);
    };

    this.play = function (source) {
      this.playing = true;
      if (this.currTrackSrc === source) {
        this.track.play();
      } else {
        this.currTrackSrc = source;
        this.track = new Audio(source);
        this.track.play();
      }
    };

    this.pause = function (source) {
      if (this.currTrackSrc === source) {
        this.track.pause();
      }
    };

    this.updateTable = function (column) {
      this.orderByField = column;
      this.reverseSort = !this.reverseSort;
    };

    this.userLogOut = function () {
      UserService.logOut(this.currentUser);
    };
  });
})();
'use strict';

(function () {
  angular.module('dopplerApp').controller('userDetailsController', function ($stateParams, UserService, StorageService) {
    var userId = $stateParams.id;

    this.currentUser = UserService.getCurrUser();
    this.userToDisplay = UserService.userById(StorageService.get('all-users'), parseInt(userId, 10));
    this.friendSongs = this.userToDisplay.songs;
    console.log(this.userToDisplay);

    this.hasFriend = UserService.userHasFriend(this.currentUser, this.userToDisplay);
    this.toggleAddFriend = function () {
      UserService.toggleFriend(this.currentUser, this.userToDisplay);
    };

    this.userLogOut = function () {
      UserService.logOut(this.currentUser);
    };
  });
})();
'use strict';

(function () {
  angular.module('dopplerApp').controller('welcomeController', function ($q, UserService, StorageService) {
    // bring in most recent user information
    this.currentUser = UserService.getCurrUser();

    this.userFriendCount = this.currentUser.friends.length;
    this.userSongCount = this.currentUser.songs.length;
    this.onlineFriends = UserService.getOnlineList(this.currentUser.friends, true);
    this.offlineFriends = UserService.getOnlineList(this.currentUser.friends, false);

    this.userLogOut = function () {
      UserService.logOut(this.currentUser);
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

    // returns an array of a user's logged in friend user objects
    function getOnlineFriends(friendsList, online) {
      var onlineList = [];
      var offlineList = [];

      friendsList.forEach(function (friend) {
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

    // checks if user has a friend
    function userHasFriend(user, friend) {
      for (var i = 0; i < user.friends.length; i++) {
        if (user.friends[i].id === friend.id) {
          return true;
        } else {
          return false;
        }
      }
    }

    // checks if user has a song
    function userHasSong(user, song) {
      for (var i = 0; i < user.songs.length; i++) {
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
        var index = user.friends.indexOf(friend);
        user.friends.splice(index, 1);
      }

      var allUsers = StorageService.get('all-users');
      var userToUpdate = getUserById(allUsers, user.id);
      angular.copy(user, userToUpdate);
      StorageService.set('all-users', allUsers);
    }

    // toggles a user like on a song
    function userToggleSong(user, song) {
      if (user.songs.indexOf(song) === -1) {
        user.songs.push(song);
      } else {
        var index = user.songs.indexOf(song);
        user.songs.splice(index, 1);
      }

      var allUsers = StorageService.get('all-users');
      var userToUpdate = getUserById(allUsers, user.id);
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