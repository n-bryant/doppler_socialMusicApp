(function() {
  angular.module('dopplerApp').controller('logInController', function($state, $q, UserService, StorageService) {
    let users = [];
    
    this.authenticate = function(username) {
      users = StorageService.get('all-users');

      $q.when(UserService.getUserData()).then((response) => {
        let randI = Math.floor(Math.random() * response.data.results.length);
        let userData = response.data.results[randI];
        this.newUser = UserService.newUser(username, userData);
        UserService.setCurrUser(this.newUser);
        users.push(this.newUser);
        StorageService.set('all-users', users);
        $state.go('DopplerParent.profile');
      }).catch((error) => {
        console.log(error);
      });
    }
  });
})();
