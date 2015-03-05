"use strict"

// Declare our module
var myApp = angular.module( 'contactListApp', [] );

// Add our controller to our module
myApp.controller( 'contactListCtrl', function( $scope, $http )
{
	// The templates available to our app
	$scope.templates = [ 
		{ name: 'list', url: 'templates/contacts_list.html' }
		,{ name: 'table', url: 'templates/contacts_table.html' } ];

	$scope.template = $scope.templates[0];

	// Load the contact list from the server
	$http.get( 'contacts.php' ).success( function( data )
	{
		$scope.contacts = data;
	} );

	// The text used to filter the contact results
	$scope.filter_text = '';

	// The method called when the filter "clear" button is clicked
	$scope.clearFilter = function()
	{
		$scope.filter_text = '';
	};
} );
