angular.module('userService',[])

// fetch api from api.js
.factory('User', function($http) {
	
	var userFactory = {};

	userFactory.create = function(userData) {
		return $http.post('/api/signup', userData);
	}

	userFactory.all = function() {
		return $http.get('/api/users');
	}

	return userFactory;

});