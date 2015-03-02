"use strict"

// Declare our module
var myApp = angular.module( 'contactListApp', [] );

// Add our controller to our module
myApp.controller( 'contactListCtrl', function( $scope, $http ){

	// Load the contact list from the server
	$http.get( '/contacts.php' ).success( function( data )
	{
		$scope.contacts = data;
	} );

} );
