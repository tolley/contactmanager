"use strict"

// Declare our module
var myApp = angular.module( 'contactListApp', [] );

// Add our controller to our module
myApp.controller( 'contactListCtrl', function( $scope, $http )
{
	$scope.templates = [ 
		{ name: 'list', url: 'templates/contacts_list.html' }
		,{ name: 'table', url: 'templates/contacts_table.html' } ];

	$scope.template = $scope.templates[0];

	// Load the contact list from the server
	$http.get( '/contacts.php' ).success( function( data )
	{
		$scope.contacts = data;
	} );

} );
