(function() {
  angular.module('dopplerApp').service('StorageService', function(localStorageService) {
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
