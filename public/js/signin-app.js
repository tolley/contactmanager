"use strict"

// Declare our app
var myApp = angular.module( 'signInApp', [] );

// Create the controller for our signin app
myApp.controller( 'signinController', function( $scope, $http, $location ) {
	// If the user is already logged in, send them to the contact manager main page
	$http.get( '/user/isloggedin' )
		.success( function( data, status, header, config ) {
			if( data.isLoggedIn === 'true' )
			{
				goToMainPage();
			}
		} );

	// Used to display any errors encountered
	$scope.errorMessage = '';

	// User to display any informative responsed from the app or the server
	$scope.statusMessage = '';

	// Holds the current state of the display
	$scope.mode = 'create';

	// The password character limits
	$scope.passwordMinLength = 8;
	$scope.passwordMaxLength = 16;

	// The user name character limits
	$scope.nameMinLength = 4;
	$scope.nameMaxLength = 20;

	// Holds data about the signin process
	$scope.login = {
		name: '',
		password: ''
	};

	// Holds data about the current create user process
	$scope.newuser = {
		name: '',
		password: '',
		repeat_password: ''
	};

	// Called when the user clicks Create Account
	$scope.doCreateUser = function() {
		clearMessages();

		// Make sure the user entered a username
		if( ! $scope.newuser.name || $scope.newuser.name.length == 0  )
		{
			$scope.errorMessage = 'Please enter a user name';
			return;
		}
		else if( $scope.newuser.name.length < $scope.nameMinLength ||
				$scope.newuser.name.length > $scope.nameMaxLength )
		{
			$scope.errorMessage = 'You username must be between ' + 
									$scope.nameMinLength +' and ' + 
									$scope.nameMaxLength + ' characters long';
		}

		// Make sure the user entered a password and a repeat password
		// and that both are equal
		if( ! $scope.newuser.password || $scope.newuser.password.length == 0 )
		{
			$scope.errorMessage = 'Please enter a password';
			return;
		}
		else if( ! $scope.newuser.repeat_password || $scope.newuser.repeat_password.length == 0 )
		{
			$scope.errorMessage = 'You must repeat your password';
			return;
		}
		else if( $scope.newuser.password != $scope.newuser.repeat_password )
		{
			$scope.errorMessage = 'Your passwords must match';
			return;
		}

		// Make sure the username meets the length requirements
		if( $scope.newuser.password.length < $scope.passwordMinLength ||
			$scope.newuser.password.length > $scope.passwordMaxLength )
		{
			$scope.errorMessage = 'Your password must be between ' + $scope.passwordMinLength +
								' and ' + $scope.passwordMaxLength + ' characters in length';
			return;
		}

		// Send our create user data to the server
		$http.post( '/login', $scope.newuser )
			.success( function( data, status, headers, config ){
				// Show any error or status messages that exist
				if( data.statusMessage )
					$scope.statusMessage = data.statusMessage;

				if( data.errorMessage )
				{
					$scope.errorMessage = data.errorMessage;
				}
				else
				{
					$scope.mode = 'signin';
				}
			} )
			.error( function( data, status, headers, config ) {
				$scope.errorMessage = 'Error signing in.';
			} );
	}

	// Called when the user wants to signin
	$scope.doSignin = function() {
		clearMessages();

		// Make sure the user has entered both a username and a password
		if( ! $scope.login.name || $scope.login.name.length == 0  )
		{
			$scope.errorMessage = 'Please enter a user name';
			return;
		}

		if( ! $scope.login.password || $scope.login.password.length == 0 )
		{
			$scope.errorMessage = 'Please enter a password';
			return;
		}

		// Send our login data to the server to log the user in
		$http.post( '/login', $scope.login )
			.success( function( data, status, headers, config ){
				if( data.statusMessage )
					$scope.statusMessage = data.statusMessage;

				if( data.errorMessage )
					$scope.errorMessage = data.errorMessage;

				if( data.login === 'successful' )
					goToMainPage();
			} )
			.error( function( data, status, headers, config ){
				if( data.errorMessage )
					$scope.errorMessage = data.errorMessage;
			} );
	};

	// Clears the messages from the scope
	function clearMessages() {
		$scope.errorMessage = '';
		$scope.statusMessage = '';
	}

	// Sends the user to the main page
	function goToMainPage()
	{
		window.location = '/contactmanager.html';
	}
} );