(function() {
  angular.module('dopplerApp').controller('appController', function(UserService, StorageService) {
    this.section = null;

    this.updateSection = function(tab) {
      if (this.section === tab) return;
      this.section = tab;
    }
  });
})();
