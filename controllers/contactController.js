// Our requires
var config 			= require( '../config' )
	,userModel		= require( '../models/user.js' )
	,contactModels	= require( '../models/contact.js' );

var contactModel = contactModels.contactModel;
var contactListModel = contactModels.contactListModel;

module.exports.controller = function( app ) {
	// Outputs the results to browser and ends the request
	function outputResults( res, data )
	{
		res.setHeader( 'Content-Type', 'application/json' );
		res.json( data );
		res.end();
	}

	// Called to pull the complete list of contacts for the logged in user
	app.get( '/contacts/all', function( req, res ) {
		contactListModel.findOne( { ownerId: req.loggedUser.id }, 
				function( err, contactList ) {
					var returnData = {};

					if( err )
					{
						returnData.status = 'error';
						returnData.message = 'Error getting contacts';
					}
					else {
						returnData.status = 'success';

						if( contactList && contactList.contacts ) {
							returnData.contacts = contactList.contacts;
						}
						else {
							returnData.contacts = [];
						}
					}

					outputResults( res, returnData );
				} );
	} );

	// Called to create a new contact
	app.post( '/contacts', function( req, res ) {
		contactListModel.update( { ownerId: req.loggedUser.id }, 
			{ $push: {
				contacts: req.body,
			} },
			function( err, numAffected ) {
				// If the insert worked
				if( numAffected.ok ) {
					var returnData = {
						status: 'success',
						message: 'Contact successfully created'
					}
				}
				else {
					var returnData = {
						status: 'error',
						message: 'Failed to create contact'
					};
				}

				outputResults( res, returnData );
		} );
	} );

	// Update contact(s)
	app.put( '/contacts', function( req, res ) {
		// Save the changes to each of the edited contacts
		if( req.body && req.body.length > 0 ) {
			// Pull the list of contacts owned by this user
			contactListModel.findOne( { ownerId: req.loggedUser.id }, 
				function( err, contactsList ) {
					if( err ) {
						outputResults( res, { 
							status: 'error',
							statusMessage: 'Unable to save contacts'
						} );
						return;
					}

					// Overwrite the contacts in the DB with the edits
					for( var n = 0; n < req.body.length; ++n ) {

						// A flag to break our inner loop as soon as we've 
						// found the contact we are looking for
						var bFound = false;

						for( var m = 0; ( m < contactsList.contacts.length ) && ( ! bFound ); ++m ) {
							if( req.body[n]._id == contactsList.contacts[m].id ) {
								// Break the loop and overwrite the contact data
								bFound = true;
								contactsList.contacts[m] = req.body[n];
							}
						}
					}

					// Update the contacts list in the DB
					contactListModel.update( 
						{ ownerId: req.loggedUser.id },
						{ contacts: contactsList.contacts }, 
						{}, 
						function( err, numAffected ) {
							// Send the results back to the user
							var results = {};
							if( ! err || numAffected.n === 1 ) {
								results.status = 'success';
								results.statusMessage = 'Contacts updated successfully';
							}
							else {
								results.status = 'error';
								results.statusMessage = 'Error updating contact information';
							}

							outputResults( res, results );
						} );
				} );
		}
		else {
			outputResults( res, { 
				status: 'error',
				statusMessage: 'Unable to save contacts'
			} );
		}
	} );

	// Delete a contact from the user's contact list
	app.delete( '/contacts/:id?', function( req, res ) {
		// Split the id by , to separate out multiple contact ids
		var ids = req.params.id.split( ',' );

		// Convert the ids into a hash table of sorts
		var idHash = [];
		for( var n = 0; n < ids.length; ++n ) {
			idHash[ids[n]] = true;
		}

		// Pull the list of the logged in user's contacts
		// and remove the specified contacts
		contactListModel.findOne( { ownerId: req.loggedUser.id },
			function( err, contactList ) {
				if( err ) {
					outputResults( res, { 
						status: 'error',
						statusMessage: 'Unable to delete contacts'
					} );
					return;
				}

				if( contactList ) {

					// Loop over each contact in the list, if it's
					// in the hash table, remove it from the list
					for( var n = contactList.contacts.length - 1; n >= 0; --n ) {
						if( idHash[ contactList.contacts[n].id ] ) {
							contactList.contacts.splice( n, 1 );
						}
					}

					// Save the contact list and return the results to the user
					contactList.save( function( err ) {
						var results = {};

						if( err ) {
							results.status = 'error';
							results.statusMessage = 'Unable to delete contacts';
						}
						else {
							results.status = 'success';
							results.statusMessage = 'Contacts successfully deleted';
						}

						outputResults( res, results );
					} );
				}
				else {
					outputResults( res, {
						status: 'error',
						statusMessage: 'Unable to delete contacts'
					} );
				}
			}

		);
	} );
}