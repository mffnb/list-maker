var ListApp = angular.module('list', ["ngResource", "ngRoute"])

ListApp.config(function($routeProvider){
	$routeProvider
		.when('/login', {
				templateUrl	: '/template/login',
				controller  : 'loginController'
		})
		.when('/', {
				templateUrl	: '/template/home',
				controller  : 'homeController'
		})
		.when('/user', {
				templateUrl	: '/template/user',
				controller  : 'userController'
		})
		.when('/list', {
				templateUrl : '/template/list',
				controller 	: 'listController'
		})
})

ListApp.controller('loginController', ['$scope', '$http', '$rootScope', '$location', function($scope, $http, $rootScope, $location){
	$scope.loginUser = {};
	$scope.loginUser.username = 'mcf';
	$scope.loginUser.password = 'test';
	$scope.userLogin = function(){
		console.log('login!', $scope.loginUser)
		$http.post('/auth/login', $scope.loginUser).then(function(returnData){
			// $scope.loginUser = {}
			console.log(returnData)
			$rootScope.user = returnData.data;
			$location.url('/user');
		})
	}
	$scope.userSignup = function(){
		console.log('signup!', $scope.signupUser)
		$http.post('/auth/signup', $scope.signupUser).then(function(returnData){
			console.log(returnData)
			$rootScope.user = returnData.data;
		})
	}		
}])

ListApp.controller('listController',  ['$scope', '$rootScope', function($scope, $rootScope){
	// $scope.user = $rootScope.user;
	$scope.listItems = [
		{
			'itemName' 	: 'Freeze Dried Blueberries',
			'claimed' 	: false,
			'storeName'	: "Trader Joe's"
		}
	]


	$scope.clearClaimed = function(){
		$scope.listItems = $scope.listItems.filter(function(item){
			if(!item.claimed){
				return item
			}
		})
		// console.log('fileredItems ', $scope.listItems)
		// console.log('fileredItems ', $scope.clearClaimed)
	}
}]);

ListApp.controller('userController', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http){
	$http.get('/api/me').then(function(returnData){
		$scope.user = returnData.data
		console.log($scope.user);
	});
	// $scope.user = $rootScope.user;
	// $scope.listItems = []
	$scope.addItem = function(){
		$scope.user.lists.push({
			'itemName': $scope.newListItem, 
			'storeName': $scope.newStoreName,
			'claimed': false
		});
		$http.post('/update-list', $scope.user).then(function(returnData){
			console.log(returnData)
		});
		//console.log('!', $scope.newListItem)
		$scope.newListItem = ''

	}

	$http.get('/api/allUsers')
	.then(function(response){
		console.log(response)
		$scope.allUsers = response.data.lists
	})



}]);

ListApp.controller('homeController', ['$scope', '$http', '$location', function($scope, $http, $location){
	$http.get('/api/me').then(function(returnData){
		// console.log(returnData);
		if (!returnData.data){
			$location.url('/login');
		}
		else {
			$scope.user = returnData.data;
		}
	})
	


}]);
	// Tuesday to do:
// see data model whiteboard photo 
// set up dynamic routing
// persist user list to db
// create person object to array of items for that person (each item can be associated to a store)
// user logs in, oAuth for fbConnect, gmail, etc.
// after login, screen needs to show 2 lists:
// 1. their items (dropdown to see only items by store- at currently)
// 2. and present a list of the people who have items requested at that store
/// from the list of people, select to show their list of items	
// function to create shopping list based on route for store optimized by shortest.