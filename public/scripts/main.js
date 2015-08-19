var ListApp = angular.module('list', ["ngResource", "ngRoute", 'ui.bootstrap'])

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
	// $scope.loginUser.username = 'mcf';
	// $scope.loginUser.password = 'test';
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


	// $scope.clearClaimed = function(itemList){
	// 	console.log('!!!')
	// 	itemList = itemList.filter(function(item){
	// 		if(!item.claimed){
	// 			return item
	// 		}
	// 	})
	// 	// console.log('fileredItems ', $scope.listItems)
	// 	// console.log('fileredItems ', $scope.clearClaimed)
	// }
}]);

ListApp.controller('userController', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http){
	$http.get('/api/me').then(function(returnData){
		$scope.user = returnData.data
		$http.get('/api/allUsers')
		.then(function(response){
			console.log(response);
			$scope.allUsers = response.data;
			$scope.masterList = _.flatten($scope.allUsers.map(function(user){
				return user.lists.map(function(item){
					item.user = user.username;
					return item;
				});
			}))
			.filter(function(item){
				return item.user !== $scope.user.username
			});
		console.log($scope.masterList);

		});		
	});
	$scope.clearClaimedUser = function(){
		$scope.user.lists = $scope.user.lists.filter(function(item){
			return !item.claimed
		})
		$http.post('/update-list', $scope.user).then(function(returnData){
			console.log(returnData)
		});
	}
	$scope.clearClaimedMaster = function(){
		$scope.masterList = $scope.masterList.filter(function(item){
			return !item.claimed
		})

		var userGrouped = _.groupBy($scope.masterList, 'user')

		 for (username in userGrouped) {
		 	var matchedUser = _.find($scope.allUsers, function(user){
		 		return user.username === username;
		 	})

		 	if(matchedUser){
			 	matchedUser.lists = userGrouped[username]

			 	$http.post('/update-list', matchedUser).then(function(returnData){
					console.log(returnData)
				});
			}
		 }

		// console.log('fileredItems ', $scope.listItems)
		// console.log('fileredItems ', $scope.clearClaimed)
	}
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
		$scope.newStoreName = ''

	}

}]);


ListApp.filter('groupByStores', function() {
	var lastResult = null;

	return function(masterList){
		var result = _.groupBy(masterList, 'storeName');
		if (lastResult && _.isEqual(result, lastResult)) {
			return lastResult;
		} else {
			lastResult = result;
			return lastResult;
		}
	}
});

ListApp.filter('groupByUserName', function() {
	var lastResults = {};
	var emptyList = [];

	return function(itemsFromStoreList){
		if (itemsFromStoreList.length === 0) {
			return emptyList;
		}

		var storeName = itemsFromStoreList[0].storeName;
		var result = _.groupBy(itemsFromStoreList, 'user');

		if (lastResults[storeName] && _.isEqual(result, lastResults[storeName])) {
			return lastResults[storeName];
		} else {
			lastResults[storeName] = result;
			return lastResults[storeName];
		}
	}
});


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