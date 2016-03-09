// create a routing system to redirect to a different page (not always index.html)

angular.module('appRoutes', ['ngRoute']) // ngRoute is not a built in dependency, need to include src in index.html

.config(function($routeProvider, $locationProvider) {

	$routeProvider
		
		// .when is a chaining method, no ';'
		.when('/', {
			templateUrl: 'app/views/pages/home.html',
			controller: 'MainController',
			controllerAs: 'main'
		})

		.when('/login', {
			templateUrl: 'app/views/pages/login.html'
		})

		.when('/signup', {
			templateUrl: 'app/views/pages/signup.html'
		})

		.when('/allStories', {
			templateUrl: 'app/views/pages/allStories.html',
			controller: 'AllStoriesController',
			controllerAs: 'story',
			resolve: {
				stories: function(Story) {
					return Story.allStories();
				}
			}
		})


	$locationProvider.html5Mode(true);
})