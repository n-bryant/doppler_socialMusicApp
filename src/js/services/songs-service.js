(function() {
  angular.module('dopplerApp').service('SongsService', function($http) {
    function getAllSongs() {
      return $http({
        method: 'GET',
        url: './src/data/songs-data.json'
      });
    }

    return {
      getSongs: getAllSongs
    }
  });
})();
