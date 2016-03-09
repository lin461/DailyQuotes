// create controller to control the data of AngularJS application.

angular.module('mainCtrl', [])

.controller('MainController', function($rootScope, $location, Auth) {
	
	var vm = this;

	vm.loggedIn = Auth.isLoggedIn();

	// scope: data available for the current view. 
	// rootScope is available for the entire application. 
	
	// an event listener to check the logged in user in every request 
	$rootScope.$on('$routeChangeStart', function() {

		vm.loggedIn = Auth.isLoggedIn();

		Auth.getUser()
			// .then returns a Promise object. 
			.then(function(data) {
				vm.user = data.data;
			});
	});

	// whenever user click Login 
	vm.doLogin = function() {

		vm.processing = true;
		vm.error = '';
		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {
				vm.processing = false;
				Auth.getUser()
					.then(function(data) {
						vm.user = data.data;
					});

				if(data.success) { // redirect user to homepage if success
					$location.path('/');
				} else {
					vm.error = data.message;
				}
			});
	}

	// logout function 
	vm.doLogout = function() {
		Auth.logout();
		$location.path('/logout');
	}


});