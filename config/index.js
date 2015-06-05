var config = {
	// The config for the actual server
	local: {
		port: 8000,
		mongo: {
			host: 'localhost',
			port: 27017
		}
	},

	// The user password hash key
	hashkey: 'lovesexsecretgod',

	// The key for signed cookies
	signedCookieSecret: 'whynot',

	// The minimum and maximum password lengths
	passwordMinLength: 8,
	passwordMaxLength: 16,

	// The minimum and maximum username length
	nameMinLength: 5,
	nameMaxLength: 20
}

// Set the config settings group that we will use based on the mode
module.exports = function( mode ){
	if( mode && config.mode )
	{
		return config.mode;
	}
	else
	{
		return config.local;
	}
}