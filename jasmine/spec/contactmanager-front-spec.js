"use strict"

describe( 'ContactListCtrl', function() {
  function getInitialContactList() {
    return [ {
      "firstname": "Abed",
      "lastname": "Nadir",
      "email": "abed.nadir@greendale.edu",
      "phone": "1231231234",
      "street": "123 Main St.",
      "city": "Greendale",
      "state": "CO",
      "zip": "29289",
      "_id": "1234567890"
    } ];
  }

  // A list of contacts for the mock backend
  var contactList = getInitialContactList();

  // Get an instance of the contact list app (note the lack of [])
  beforeEach( module( 'contactListApp' ) );
  var $controller, scope, $httpBackend;


  beforeEach( angular.mock.inject( function( $rootScope, $controller, _$httpBackend_ ) {
    // Create our new scope object
    scope = $rootScope.$new();

    // Create the controller and pass it the scope
    $controller( 'contactListCtrl', { $scope: scope } );
    $httpBackend = _$httpBackend_;

    $httpBackend.expectGET( '/contacts' )
                .respond( 200, { 'status': 'success', 'contacts': contactList } );

    $httpBackend.expectGET( 'data/states.json' )
                .respond( 200, [ {"value": "AL","name": "Alabama"}, {"value": "AK","name": "Alaska"} ] );

    $httpBackend.expectGET( 'templates/contacts_main.html' )
                .respond( 200, '' );

    $httpBackend.expectGET( 'templates/contacts_list.html' )
                .respond( 200, '' );

    // Reset the contact list stored on the "backend"
    contactList = getInitialContactList();
  } ) );



  // Test the loading of contacts by the controller
  it( 'should load a list of contacts from the server', function() {
    scope.initializeData();
    $httpBackend.flush();

    expect( scope.contacts.length ).toBe( 1 );
  } );



  // Test creating a contact
  it( 'should create a new contact', function() {
    // Make sure the contacts are loaded before we try to add one
    scope.initializeData();
    $httpBackend.flush();

    // The data for our new user
    var newContact = {
      "firstname":  "chris",
      "lastname":   "tolley",
      "email":      "neotolley@hotmail.com",
      "phone":      "1231231234",
      "street":     "123 Main St",
      "street2":    "A2",
      "city":       "Cityville",
      "state":      "VA",
      "zip":        "20165"
    };

    // Set up a POST request so we can validate the data, and add the contact to the
    // "backend" list
    $httpBackend.when( 'POST', '/contacts', function( postData ) {
      var data = JSON.parse( postData );

      // Add the id that the backend is supposed to create then the insert happens
      data._id = '0987654321';

      // Brief data validation
      expect( data.firstname ).toBe( newContact.firstname );
      expect( data.email ).toBe( newContact.email );

      // Add the contact to the "backend"
      contactList.push( data );

      return true;
    } )
      .respond( 200, { "status": "success", "message": "Contact successfully created" } );

    // Once the new contact is created, another call to get all contacts should be issued
    // by the controller
    $httpBackend.expectGET( '/contacts' )
                .respond( 200, { 'status': 'success', 'contacts': contactList } ); 

    scope.newcontact = newContact;
    scope.createContact( true );
    $httpBackend.flush();

    expect( scope.contacts.length ).toBe( 2 );
  } );



  // Test editing a contact
  it( 'should edit a contact', function() {
    // Make sure the contacts are loaded before we try to edit one
    scope.initializeData();
    $httpBackend.flush();

    $httpBackend.expectGET( 'templates/contacts_edit.html' )
                .respond( 200, '' );

    // Set up the PUT request that will save the contact
    $httpBackend.whenPUT( '/contacts', function( data ) {
      var putData = JSON.parse( data );

      expect( putData[0].firstname ).toBe( 'edit' );
      expect( putData[0].lastname ).toBe( 'edit' );

      contactList[0] = putData[0];

      // Return success
      return true;
    } )
    .respond( 200, { 'status': 'success', 'statusMessage': 'Contacts updated successfully' } );

    // Once the edits have been saved, the controller should automatically reload 
    // the list of contacts from the "backend"
    $httpBackend.expectGET( '/contacts' )
                .respond( 200, { 'status': 'success', 'contacts': contactList } );

    // Tell the scope that we want to edit the only contact in our list
    scope.editContact( scope.contacts[0] );
    expect( scope.contactsUnderEdit.length ).toBe( 1 );

    // Modify the contact and save it
    scope.contactsUnderEdit[0].firstname = 'edit';
    scope.contactsUnderEdit[0].lastname = 'edit';

    scope.saveEdits(); 

    $httpBackend.flush();

    // Make sure the edits worked
    expect( scope.contacts[0].firstname ).toBe( 'edit' );
    expect( scope.contacts[0].lastname ).toBe( 'edit' );
  } );



  // Test the changeSort function on the state
  it( 'should order by lastname desc', function() {
    scope.initializeData();
    $httpBackend.flush();

    // This should set the order by to lastname descending
    scope.state.changeSort( 'lastname', true );

    expect( scope.state.order_by_field ).toBe( 'lastname' );
    expect( scope.state.order_by_desc ).toBeTruthy();
  } );



  it( 'should delete a contact', function() {
    scope.initializeData();
    $httpBackend.flush();

    // Set up the delete request assertion on our fake backend
    $httpBackend.whenDELETE( '/contacts/' + scope.contacts[0]._id, function( JSONData ) {
      // Remove the contact from the backend
      contactList.shift();

      // A bit of testing for the backend so I'll know if/when I brake a test
      expect( contactList.length ).toBe( 0 );

      return true;
    } )
    .respond( 200, { "status": "success", "statusMessage": "Contacts successfully deleted" } );

    scope.deleteContact( scope.contacts[0] );
    $httpBackend.flush();

    // There should be two contacts (one initial one, and one added by 
    // the create contact test)
    expect( scope.contacts.length ).toBe( 0 );
  } );

  afterEach( function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      $httpBackend.resetExpectations();
  } );
} );