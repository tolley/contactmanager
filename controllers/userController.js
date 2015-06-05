// Our requires
var config = require( '../config' )
	,userModel = require( '../models/user.js' );

// Export our controller object
module.exports = {

	// Called on POST to create a new user
	createNewUser: function( req, res )
	{
		console.log( 'creating user with ', req.body );

		// An object to store our result messages (errors)
		var results = {
			errors: []
			,newuser: false
		};

		// Create and save a new user
		var newUser = new userModel( req.body );

		newUser.save( function( err ) {
			if( err )
			{
				console.log( err );
				// Check to see if we got the duplicate user error
				if( err.errmsg.indexOf( 'duplicate key' ) !== 0 )
				{
					console.log( 'tolley: dup user found' );
					results.errors.push( 'That user name already exists.' +
											' Please login or choose a different name' );
				}
				else
				{
					results.errors.push( 'Error creating user, please try again' );
				}
			}
			else
			{
				results.newuser = newUser;
			}

			// If there are no errors and if a user object exists
			if( results.errors.length == 0 && results.newuser )
			{
				var returnData = {
					statusMessage: 'User successfully created, please login'
				};
			}
			else
			{
				var errorMessages = '';
				for( var i in results.errors )
					errorMessages += results.errors[i] + ' ';

				var returnData = {
					errorMessage: errorMessages
				};
			}

			// Send the results to the browser
			res.setHeader( 'Content-Type', 'application/json' );
			res.json( returnData );
			res.end();
		} );
	},

	signin: function( req, res ) {

	}
};

