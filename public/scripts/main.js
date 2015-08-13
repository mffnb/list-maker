angular.module('list', [])
.controller('listController', ['$scope', function($scope){
	$scope.listItems = [
		{
			'itemName' : 'Blueberries',
			//'itemName' : 'View UI',
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
		console.log('fileredItems ', $scope.listItems)
		// console.log('fileredItems ', $scope.clearClaimed)
	}


}]);
// user logs in, oAuth for fbConnect, gmail, etc.
// screen needs to show their items (dropdown to see only items by store- at currently)
// and present a list of the people who have items requested at that store
/// from the list of people, select to show their list of items	