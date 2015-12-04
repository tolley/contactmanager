"use strict"

// Declare our module
var myApp = angular.module( 'contactListApp', ['ngRoute'] );

// Add our controller to our module
myApp.controller( 'contactListCtrl', [ '$scope', '$http', '$location', 'contactMangerStateService',
	function( $scope, $http, $location, state ) {
		$scope.state = state;

		// The header template for all pages
		$scope.header_template_url = "/templates/contacts_header.html";

		// A flag to keep track of whether the menu is open or closed
		// Note: This menu is only for mobile mode (reduced width)
		$scope.mobile_menu_visible = false;

		// The message that will display above each page
		$scope.header_message = 'Create, edit, and manage your contact information';

		// A function called to load the relevant data onto the scope.  It only executes once
		// when the page is loaded
		$scope.initializeData = function() {
			// An array to hold all of the contacts that are pulled from the server
			$scope.contacts = [];

			// Load the contact list from the server
			$http.get( '/contacts/all' )
				.success( $scope.handleJSONResponse );

			// Load the list of states from the server
			$http.get( 'data/states.json' ).success( function( data )
			{
				$scope.states = data;
			} );

			// An array to keep track of which contacts are being edited.
			$scope.contactsUnderEdit = [];
		};

		// The method called when the filter "clear" button is clicked
		$scope.clearFilter = function()
		{
			$scope.state.filter_text = '';
		};

		// An object to store the new contact data
		$scope.newcontact = {};

		// Called to add a new contact
		$scope.createContact = function( isValid ) {
			// If the form inputs pass our validation
			if( isValid )
			{
				// Send the data to the server to be saved
				$http.post( '/contacts', $scope.newcontact )
					.success( function( data, status, headers, config ) {
						// Remove the details of the new contact from the new contact object
						// so we can reuse it
						$scope.newcontact = {};

						// Send the reponse data to the generic method that will handle that
						$scope.handleJSONResponse( data );

						// If we got a success status back, reload the contact information
						if( data.status === 'success' )
						{
							$http.get( '/contacts' )
								.success( function( data, status, headers, config ) { 
									$scope.handleJSONResponse( data );

									// Send the user back to the list page
									$location.path( '' );
								} );
							// To Do: Handle .error case
						}
					} )
					.error( function( data, status, headers, config ) {
					} );
			}
		};

		// Called when the user clicks on Cancel on the Add New Contact page
		$scope.cancelCreateContact = function() {
			// Remove the details of the new contact from the new contact object
			// so we can reuse it
			$scope.newcontact = {};

			// Send the user back to the listing page
			$location.path( '' );
		};

		// Called to cancel the adding of a new contact
		$scope.cancelCreateContact = function()
		{
			$scope.newcontact = {};
			$location.path( '' );
		};

		// Called when the delete contact link is clicked
		$scope.deleteContact = function( contact )
		{
			if( ! contact ) {
				return false;
			}

			if( confirm( "Are you sure you want to delete this contact?") )
			{
				$http.delete( '/contacts/' + contact._id )
					.success( function( data, status, headers, config ) {
						// Find the selected contact and remove it from the array of contacts
						for( var n in $scope.contacts )
						{
							if( $scope.contacts[n]._id === contact._id )
							{
								$scope.contacts.splice( n, 1 );
							}

						}

						$scope.handleJSONResponse( data );
					} )
					.error( function( data, status, headers, config ) {
						$scope.handleJSONResponse( data );
					} );
			}
		};

		// Called when the user clicks on the edit link
		$scope.editContact = function( contact )
		{
			if( ! contact )
				return false;

			// Make sure there aren't already any contacts being edited
			if( $scope.contactsUnderEdit.length > 0 )
			{
				$scope.contactsUnderEdit.splice( 0, $scope.contactsUnderEdit.length );
			}

			// The the contact to the list so it will be reflected in the view
			$scope.contactsUnderEdit.push( contact );

			// Send the user to the edit page
			$location.path( '/edit' );
		};

		// Called when the user clicks save on the edit contacts section
		$scope.saveEdits = function()
		{
			// Send each of the contacts that have been edited to the server to be saved
			$http.put( '/contacts', $scope.contactsUnderEdit )
				.success( function( data, status, headers, config ) {
					// Send the reponse data to the generic method that will handle it
					$scope.handleJSONResponse( data );

					if( data.status === 'success' )
					{
						// Send the user back to the list page and reload all the contact data
						$http.get( '/contacts/all' )
								.success( function( data, status, headers, config ) { 
									$scope.handleJSONResponse( data );

									// Send the user back to the list page
									$location.path( '' );
								} );
					}
				} );
		};

		// Called when the user clicks Cancel while editing contacts
		$scope.cancelEdit = function() {
			// Empty the list of contacts that are being edited
			$scope.contactsUnderEdit.splice( 0, $scope.contactsUnderEdit.length );

			$location.path( '' );
		};

		// Called when the user clicks on the go button on the table view
		$scope.performSelectedAction = function()
		{
			// Switch based on the selected action
			switch( $scope.state.actions.selected )
			{
				case 'delete':
					// Build the url, which is comma separated list of contact ids
					var ids = [];

					for( var n = 0; n < $scope.contacts.length; ++n ) {
						if( $scope.contacts[n].selected ) {
							ids.push( $scope.contacts[n]._id );
						}
					}

					if( ids.length > 0 ) {
						// Make the user confirm that they want to delete the selected contacts
						if( confirm( 'Are you sure you want to delete the selected contacts?' ) ){
							$http.delete( '/contacts/' + ids.join() )
								.success( function( data, status, headers, config ) {
									// Find the selected contacts and remove them from the array of contacts
									for( var n = $scope.contacts.length - 1; n >= 0; --n ) {
										if( $scope.contacts[n].selected ) {
											$scope.contacts.splice( n, 1 );
										}
									}

									$scope.handleJSONResponse( data );
								} )
								.error( function( data, status, headers, config ) {
									$scope.handleJSONResponse( data );
								} );
						}
					}
					break;

				case 'edit':
					// Gather each selected contact and add them to the array of contacts
					// that are being edited
					if( $scope.contactsUnderEdit.length > 0 ) {
						$scope.contactsUnderEdit.splice( 0, $scope.contactsUnderEdit.length );
					}

					for( var n = 0; n < $scope.contacts.length; ++n ) {
						if( $scope.contacts[n].selected ) {
							$scope.contactsUnderEdit.push( cleanContact( $scope.contacts[n] ) );
						}
					}

					// If there are contacts to be edited, send the user to the edit page
					if( $scope.contactsUnderEdit.length > 0 )
					{
						$location.path( '/edit' );
						return;
					}
					break;
			}
		};

		// Handles the response from one of the requests to the contacts API
		$scope.handleJSONResponse = function( data ) {
			// If the user isn't logged in, send them to the signin page
			if( data.login_error ) {
				window.location.href = '/signin.html';
			}

			if( data.statusMessage && data.statusMessage.length > 0 ) {
				$scope.responseMessage = data.statusMessage;
			}

			// If we have a contact list, place it on the scope for the user to 
			// interact with
			if( data.contacts ) {
				// Empty all of the stored contacts from the scope
				// If we just set contacts = to a new array, that will destroy
				// angular's events attached to it and the view won't update
				$scope.contacts.splice( 0, $scope.contacts.length );

				// Add the contacts from the data object
				for( var n = 0; n < data.contacts.length; ++n )
				{
					$scope.contacts.push( data.contacts[n] );
				}
			}
		};

		// Handles the logout request
		$scope.doLogout = function() {
			$http.get( '/user/logout' )
				.success( function( data, status, headers, config ) {
					if( data.loggedOut ) {
						// Send the user back to the signin page
						location.href = '/signin.html';
					}
				} );
		}

		// Removes all fields from a contact that we don't want to send to the
		// server
		function cleanContact( contact ) {
			delete contact.selected;
			return contact;
		};
	}
] ); // End controller definition

// Create the routes for this app
myApp.config( function( $routeProvider )
{
	$routeProvider.when( '/new', {
		templateUrl: 'templates/contact_new.html',
		controller: 'contactListCtrl'
	} );

	$routeProvider.when( '/edit', {
		templateUrl: 'templates/contact_edit.html',
		controller: 'contactListCtrl'
	} );

	// The default route, shows the sortable, filterable contact list
	$routeProvider.otherwise( {
		templateUrl: 'templates/contacts_main.html',
		controller: 'contactListCtrl'
	} );
} );
