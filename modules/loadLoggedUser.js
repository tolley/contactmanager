// Some middleware that will try to load the logged in user's data
// and attach it to the request object
var cryptoFuncs = require( '../modules/cryptoFuncs.js' )
	,userModel	= require( '../models/user.js' )

module.exports = function() {
	return function( req, res, next ) {
		if( req.signedCookies['user'] )
		{
			// Decrypt the user id
			var userId = cryptoFuncs.decrypt( req.signedCookies['user'] );

			// If the user id was successfully decrypted
			if( userId && userId.length > 0 )
			{
				// Find the user's data and call the next function
				userModel.findById( userId, function( err, user ) {
					if( ! err )
					{
						// Save the logged user data on the req object and call our next function
						req.loggedUser = new userModel( user );
						next();
					}
				} )
			}
			else
			{
				next();
			}
		}
		else
		{
			next();
		}
	}
}