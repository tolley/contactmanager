// Get our required objects
var mongoose = require( 'mongoose' )
	,Sha1 = require( '../modules/sha1.js' )
	,config = require( '../config' )
	,userModel	= require( '../models/user.js' )
	,cryptoFuncs = require( '../modules/cryptoFuncs.js' );

// Create our user schema
var userSchema = new mongoose.Schema( {
	name: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	last_update: Date
} );

// Create validation rules for user data
userSchema.path( 'name' ).validate( function( value ) {
	if( ! value || value.length < config.nameMinLength ||
		value.length > config.nameMaxLength )
	{
		return false;
	}
	else
		return true;
}, 'Your username must be between ' + config.nameMinLength + ' and ' + 
	config.nameMaxLength + ' characters long' );

// Create a method to hash the password
userSchema.statics.hashPlainTextPassword = function( password )
{
	return Sha1.hash( config.passwordHashKey + password );
}

// Plug into the pre save event so that we can hash the password and
// set create_date and last_update
userSchema.pre( 'save', function( next ) {
	// Set the last_update to now
	this.last_update = new Date();

	// Hash the password
	this.password = userSchema.statics.hashPlainTextPassword( this.password );

	// Delete repeat_password if it's there
	if( this.repeat_password )
		delete this.repeat_password;

	return next();
} );

// Export our model
module.exports = mongoose.model( 'User', userSchema );
