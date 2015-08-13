var List = angular.module('list', ["ngResource", "ngRoute"])

List.config(function($routeProvider){
	$routeProvider
		.when('/', {
				templateUrl	: '/template/home',
				controller  : 'listController'
		})
		.when('/persons', {
				templateUrl	: '/template/persons',
				controller  : 'personsController'
		})

		.when('/login', {
				templateUrl	: '/template/login',
				controller  : 'loginController'
		})
})
List.controller('loginController', ['$scope', function($scope){
console.log('hello login')
}])

List.controller('listController', ['$scope', function($scope){
	$scope.listItems = [
		{
			'itemName' : 'Blueberries',
			'claimed' : false
		}
	]

	$scope.addItem = function(){
		$scope.listItems.push({
			'itemName': $scope.newListItem, 
			'claimed': false
		})
		//console.log('!', $scope.newListItem)
		$scope.newListItem = ''
	}

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

//.personController
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