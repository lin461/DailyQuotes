// create an angular service
// angular call all the json values in the server and render them to HTML

// MVC Pattern: services will fetch all the data and pass them to controllers
// controllers will manipulate data and pass them to a route 
// route will render the view in html

angular.module('authService',[])


// create Auth factory to fetch api from the Server (api.js in routes folder)
.factory('Auth', function($http, $q, AuthToken) { // $q is a promise object

	var authFactory = {}; // to store all the methods in the factory 

	// get login api 
	authFactory.login = function(username, password) {

		return $http.post('/api/login', {
			username: username,
			password: password
		})

		// whenever we login, we get a token
		// set token and return data
		// .success is a Promise function just like the Callback function in Node.js
		.success(function(data) {
			AuthToken.setToken(data.token);
			return data;
		})
	}

	authFactory.logout = function() {
		AuthToken.setToken(); //clear the token
	}

	// check login status by token
	authFactory.isLoggedIn = function () {
		if (AuthToken.getToken()) {
			return true;
		} else {
			return false;
		}
	}

	// get user information (id, name, username)
	authFactory.getUser = function() {
		if (AuthToken.getToken()) {
			return $http.get('/api/me');
		} else {
			return $q.reject({ message: "User has no token!"});
		}
	}

	return authFactory;

})

// create the AuthToken factory and pass in a $window object
.factory('AuthToken', function($window) {

	var authTokenFactory = {};

	// get token from the browser after login 
	authTokenFactory.getToken = function () {
		return $window.localStorage.getItem('token');
	}

	// set the legitimate token 
	authTokenFactory.setToken = function(token) {
		if (token) {
			$window.localStorage.setItem('token', token);
		} else {
			$window.localStorage.removeItem('token');
		}
	}

	return authTokenFactory;

})

// create the AuthInterceptor factory
.factory('AuthInterceptor', function($q, $location, AuthToken) {

	var interceptorFactory = {};

	interceptorFactory.request = function(config) {

		var token = AuthToken.getToken();

		// if token exist in the local storage, put it in the headers.
		// so no need to login again in another browser tab. 
		if (token) {
			config.headers['x-access-token'] = token;
		}

		return config;
	};

	//interceptorFactory.responseError = function(response) {

	//	if(response.status == 403) {
	//		$location.path('/login');
	//	}

	//	return $q.reject(response);
	//}

	return interceptorFactory;


});






