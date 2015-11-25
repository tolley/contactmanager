// Some middleware that will try to load the logged in user's data
// and attach it to the request object.  If no user is logged in, some
// json data is sent to the user informing them of such and the request is ended
var cryptoFuncs = require( '../modules/cryptoFuncs.js' )
	,userModel	= require( '../models/user.js' );

function noUserFound( res ) {
	res.setHeader( 'Content-Type', 'application/json' );
	res.json( { login_error: true } );
	res.end();
}

module.exports = function( req, res, next ) {
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
			noUserFound( res );
		}
	}
	else
	{
		noUserFound( res );
	}
}