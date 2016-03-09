// create a new directive

angular.module('reverseDirective',[])

// create a new directive called reverse 
.filter('reverse', function() {

	return function(items) { // items is an array
		if (!items) {return;}
		return items.slice().reverse(); // use JS built-in reverse() function
	}
	
});