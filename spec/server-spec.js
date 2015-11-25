"use strict"

var request = require( 'request' );
request = request.defaults( { jar: true } );

// The unit tests for the contact manager server
describe( 'contact manager server', function() {
	var url = 'http://localhost.com:8000';

	// The data needed to create a contact
	var newContactData = {
		    "firstname": "unit",
		    "lastname": "test",
		    "email": "unittest01@hotmail.com",
		    "phone": "1231231235",
		    "street": "123 Main St.",
		    "city": "Testville",
		    "state": "VA",
		    "zip": "24572"
	    };

	// The data needed to create a user
	var userData = {
		"name": "unittest",
		"password":"password",
		"repeat_password":"password"
	};

	// A place to store the list of contact retrieved from the server after
	// these tests create one.  Used later in the update and delete tests
	var serverContactList = [];


	it( 'should fail to login', function() {
		var postData = {"name":userData.name,"password":userData.password};

		var options = {
			url: url + '/login', 
			form: postData
		};

		var responseBody = false;

		runs( function() {
			request.post( options, function( error, response, body ) {
				if( ! error ) {
					responseBody = JSON.parse( body );
				}
			} );
		} );

		waitsFor( function() {
			return typeof responseBody == 'object';
		}, 'login should return', 1000 );

		runs( function() {
			expect( responseBody.login ).toBe( 'failed' );
		} );
	} );


	it( 'should fail to get a list of contacts', function() {
		var responseBody = false;

		runs( function() {
			request.get( { url: url + '/contacts/all' }, 
				function( error, response, body ) {
					if( ! error ) {
						responseBody = JSON.parse( body );

						// Save the contacts from the server for testing
						// updating and deleting
						serverContactList = responseBody.contacts;
					}
				} );
		} );

		waitsFor( function() {
			return typeof responseBody == 'object';
		}, 'contacts/all should return', 1000 );

		runs( function() {
			expect( responseBody.login_error ).toBeTruthy();
		} );
	} );


	it( 'should create a user', function() {
		var postData = userData;

		var options = {
			url: url + '/signup',
			form: postData
		};

		var responseBody = false;

		runs( function() {
			request.post( options, function( error, response, body ) {
				if( ! error ) {
					responseBody = JSON.parse( body );
				}
			} );
		} );

		waitsFor( function() {
			return typeof responseBody == 'object';
		}, 'signup should return', 1000 );

		runs( function() {
			expect( responseBody.status ).toBe( 'success' );
		} );
	} );


	it( 'should login successfully', function() {
		var postData = {"name":userData.name,"password":userData.password};

		var options = {
			url: url + '/login', 
			form: postData
		};

		var responseBody = false;

		runs( function() {
			request.post( options, function( error, response, body ) {
				if( ! error ) {
					responseBody = JSON.parse( body );
				}
			} );
		} );

		waitsFor( function() {
			return typeof responseBody == 'object';
		}, 'login should return', 1000 );

		runs( function() {
			expect( responseBody.login ).toBe( 'successful' );
		} );
	} );


	it( 'should create a contact', function() {
		var options = {
			url: url + '/contacts/create',
			form: newContactData
		};

		var responseBody = false;

		runs( function() {
			request.post( options, function( error, response, body ) {
				if( ! error ) {
					responseBody = JSON.parse( body );
				}
			} );
		} );

		waitsFor( function() {
			return typeof responseBody == 'object';
		}, 'contacts/create should return', 1000 );

		runs( function() {
			expect( responseBody.status ).toBe( 'success' );
		} );
	} );


	it( 'should get a list of contacts', function() {
		var responseBody = false;

		runs( function() {
			request.get( { url: url + '/contacts/all' }, 
				function( error, response, body ) {
					if( ! error ) {
						responseBody = JSON.parse( body );

						// Save the contacts from the server for testing
						// updating and deleting
						serverContactList = responseBody.contacts;
					}
				} );
		} );

		waitsFor( function() {
			return typeof responseBody == 'object';
		}, 'contacts/all should return', 1000 );

		runs( function() {
			expect( responseBody.status ).toBe( 'success' );
		} );
	} );


	it( 'should edit a contact', function() {
		var responseBody = false;

		// If there is a contact from the server (if the previous test was successful
		// in creating one)
		if( serverContactList.length > 0 ) {
			// Make some edits to the contact
			serverContactList[0].firstname = 'edit';
			serverContactList[0].lastname = 'edit';
		}
		else {
			// Otherwise, we can't edit, and we should fail this test and return
			expect( serverContactList.length ).toBeGreaterThan( 0 );
			return;
		}

		runs( function() {
			request( {
					url: url + '/contacts/save',
					method: 'PUT',
					json: serverContactList
				}, 
				function( error, response, body ) {
					if( ! error ) {
						responseBody = body;
					}
				} );
		} );

		waitsFor( function() {
			return typeof responseBody == 'object';
		}, 'contacts/save should return', 1000 );

		runs( function() {
			expect( responseBody.status ).toBe( 'success' );
		} );
	} );


	it( 'should delete a contact', function() {
		// Get the id of the contact for the delete
		var id = serverContactList[0]._id;

		var options = {
			url: url + '/contacts/' + id
		};

		var responseBody = false;

		runs( function() {
			request.del( options, function( error, response, body ) {
				if( ! error ) {
					responseBody = JSON.parse( body );
				}
			} );
		} );

		waitsFor( function() {
			return typeof responseBody == 'object';
		}, 'contact delete should return', 10000 );

		runs( function() {
			expect( responseBody.status ).toBe( 'success' );
		} );
	} );

	it( 'should delete the user account', function() {
		var options = {
			url: url + '/user'
		};

		var responseBody = false;

		runs( function() {
			request.del( options, function( error, response, body ) {
				if( ! error ) {
					responseBody = JSON.parse( body );
				}
			} );
		} );

		waitsFor( function() {
			return typeof responseBody == 'object';
		}, 'user delete should return', 10000 );

		runs( function() {
			expect( responseBody.status ).toBe( 'success' );
		} );
	} );
} );