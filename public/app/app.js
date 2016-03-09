// an AngularJS module defines an application.
// module is a container for different parts of the application.
// module contains application controllers.

// Define MyApp 

angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService','userCtrl','userService', 'storyService', 'storyCtrl', 'reverseDirective'])


.config(function($httpProvider) {
	
	// constantly pushing the token to http request 
	$httpProvider.interceptors.push('AuthInterceptor');
})