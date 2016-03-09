angular.module('userCtrl', ['userService'])

// get the user data and render it to HTML
.controller('UserController', function(User) {

	var vm = this;

	vm.processing = true;

	User.all()
		.success(function(data) {
			vm.users = data;
		})


})

// create a user and redirect to home page
.controller('UserCreateController', function(User, $location, $window) {

	var vm = this;

	vm.signupUser = function() {
		vm.message = '';

		User.create(vm.userData)
			.then(function(response) {
				vm.userData = {};
				vm.message = response.data.message;

				$window.localStorage.setItem('token', response.data.token);
				$location.path('/');
			})
	}
})