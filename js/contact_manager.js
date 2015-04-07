"use strict"

// Declare our module
var myApp = angular.module( 'contactListApp', ['ngRoute'] );

// Add our controller to our module
myApp.controller( 'contactListCtrl', function( $scope, $http, $location )
{
	// A function called to load the relevant data onto the scope.  It only executes once
	var initializeData = function()
	{
		if( $scope.initialized === undefined )
		{
			// Make sure this function only executes once
			$scope.initialized = true;

			// A variable used to generate ids (primary key) for each contact that 
			// is generated by this app (in place of a backend)
			$scope.contact_id_generator = false;

			// The templates available to our app
			$scope.templates = [ 
				{ name: 'list', url: 'templates/contacts_list.html' }
				,{ name: 'table', url: 'templates/contacts_table.html' } ];

			// The currently selected template
			$scope.template = $scope.templates[0];

			// Load the contact list from the server
			$http.get( 'data/contacts.php' ).success( function( data )
			{
				$scope.contacts = data;

				// Set the id generator to the id of the last contact loaded from the server
				// plus one (so we don't need a backend and so the code will be easily used with a backend)
				$scope.contact_id_generator = $scope.contacts.length;
			} );

			// An array that will hold any selected contacts from the list view
			$scope.selectedContacts = [];

			// Load the list of states from the server
			$http.get( 'data/states.php' ).success( function( data )
			{
				$scope.states = data;
			} );

			// The text used to filter the contact results
			$scope.filter_text = '';

			// An array to keep track of the current order by
			$scope.order = {
				'firstname': true,
				'lastname': false,
				'email': false
			};

			// The default order by column
			$scope.order_by = 'firstname';

			// Keeps track of whether or not to reverse the order of the contacts
			$scope.order_by_reverse = false;

			// An object that will keep track of the available actions and which one is selected 
			// for the table view to use
			$scope.actions = {
				selectableActions: [
					{ value: 'delete', name: 'Delete' },
					{ value: 'edit', name: 'Edit' } ],
				selected: ''
			};

			// An array to keep track of which contacts are being edited.
			$scope.contactsUnderEdit = [];
		}

		// If we are not editing a contact, make sure the contactsUnderEdit array is empty
		if( $location.path() !== '/edit' && $scope.contactsUnderEdit.length > 0 )
		{
			$scope.contactsUnderEdit.splice( 0, $scope.contactsUnderEdit.length );
		}
	}();

	// The method called when the filter "clear" button is clicked
	$scope.clearFilter = function()
	{
		$scope.filter_text = '';
	}

	// An object to store the new contact data
	$scope.newcontact = {};

	// Called to add a new contact
	$scope.createContact = function()
	{
		// To Do: Add validation

		// Assuming the validation passes (To Do), add the contact
		var newContact = $scope.newcontact;
		newContact.id = ++$scope.contact_id_generator;
		$scope.contacts.push( newContact );

		// Send the user to the contact list page
		$location.path( '' );
	}

	// Called to cancel the adding of a new contact
	$scope.cancelCreateContact = function()
	{
		$location.path( '' );
	}

	$scope.onSort = function( field )
	{
		// If a field was passed in
		if( field && field.length > 0 )
		{
			// If field is already the order by field
			if( $scope.order_by === field )
			{
				// We need to reverse the direction
				$scope.order_by_reverse = ! $scope.order_by_reverse;
			}
			else
			{
				// Make sure order_by_reverse is true (each column needs to always start in a given direction)
				$scope.order_by_reverse = false;

				// Update the order by property which the template uses to order the contacts
				$scope.order_by = field;
			}
		}
		else
		{
			// Otherwise, it means that the order_by variable was updated directly from the UI
			field = $scope.order_by;
		}

		// Update the flags that allow our template to use the correct styles
		for( var fieldName in $scope.order )
		{
			$scope.order[fieldName] = false;
		}

		// Make sure the selected field is set to true
		$scope.order[field] = true;
	}

	// Called when the delete contact link is clicked
	$scope.deleteContact = function( contact )
	{
		if( ! contact )
			return false;

		if( confirm( "Are you sure you want to delete this contact?") )
		{
			// Find the selected contact and remove it from the array of contacts
			for( var n in $scope.contacts )
			{
				if( $scope.contacts[n].id === contact.id )
				{
					$scope.contacts.splice( n, 1 );
					return true;
				}

			}
		}
	}

	// Called when the user clicks on the edit link
	$scope.editContact = function( contact )
	{
		if( ! contact )
			return false;

		// Add the contact to the list of contacts that we are editing
		if( $scope.contactsUnderEdit.length > 0 )
		{
			// Make sure there aren't already any contacts being edited
			$scope.contactsUnderEdit.splice( 0, $scope.contactsUnderEdit.length );
		}

		// The the contact to the list so it will be reflected in the view
		$scope.contactsUnderEdit.push( contact );

		// Send the user to the edit page
		$location.path( '/edit' );
	}

	// Called when the user clicks save on the edit contacts section
	$scope.saveEdits = function()
	{
		// Foreach contact in the contactsUnderEdit array, move them back into the 
		// array of contacts
		for( var n in $scope.contactsUnderEdit )
		{
			// Find the contact in the array of all contacts
			for( var i in $scope.contacts )
			{
				// If we found the contact, overwrite it with the edits
				if( $scope.contacts[i].id === $scope.contactsUnderEdit[n].id )
				{
					$scope.contacts[i] = $scope.contactsUnderEdit[n];
				}
			}
		}

		// Clear out contactsUnderEdit and send the user back to the homepage
		$scope.contactsUnderEdit.splice( 0, $scope.contactsUnderEdit.length );
		$location.path( '/' );
	}

	// Called when a contact is selected or deselected in the table view
	$scope.toggleSelectContact = function( contact )
	{
		var index = $scope.selectedContacts.indexOf( contact.id );

		// If the contact is already selected
		if( index > -1 )
		{
			// Remove the selected contact from the list
			$scope.selectedContacts.splice( index, 1 );
		}
		else
		{
			// Otherwise, add the selected contact to the list
			$scope.selectedContacts.push( contact.id );
		}
	}

	// Called when the user clicks on the go button on the table view
	$scope.performSelectedAction = function()
	{
		// If there are no selected contacts
		if( $scope.selectedContacts.length === 0 )
			return;

		// Switch based on the selected action
		switch( $scope.actions.selected )
		{
			case 'delete':
				// Make the user confirm that they want to delete the selected contacts
				if( confirm( 'Are you sure you want to delete the selected contacts?' ) )
				{
					// Foreach selected contact, delete it
					for( var n in $scope.selectedContacts )
					{
						// Find the index of the nth selected contact
						var index = false;
						for( var i in $scope.contacts )
						{
							if( $scope.contacts[i].id === $scope.selectedContacts[n] )
							{
								index = i;
							}
						}

						// If we found our contact, remove it
						if( index )
						{
							$scope.contacts.splice( index, 1 );
						}
					}

					// Set the selected contacts to an empty array
					$scope.selectedContacts = [];
				}
				break;

			case 'edit':
				// Foreach of the selected contacts, add the contact details to the list of contacts
				// being edited
				for( var n in $scope.selectedContacts )
				{
					// Find each of the selected contacts in the list of contacts
					for( var i in $scope.contacts )
					{
						if( $scope.contacts[i].id === $scope.selectedContacts[n] )
						{
							// Add the selected contact to the list of contacts being edited
							$scope.contactsUnderEdit.push( $scope.contacts[i] );
						}
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
	}
} );

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
