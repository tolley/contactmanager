module.exports = {
	// The config for the actual server
	server: {
		port: 8000
	},

	// The settings for the mongo DB connection
	mongo: {
		host: 'localhost',
		port: 27017
	},

	// The user password hash key
	hashkey: 'lovesexsecretgod',

	// The key for signed cookies
	signedCookieSecret: 'whynot',

	// The key for the encryption/decryption operations
	crypto: {
		key: 'IheardreallylongkeysarethebestsoImadethisoneup',
		algorithm: 'aes-256-ctr'
	},

	// The minimum and maximum password lengths
	passwordMinLength: 8,
	passwordMaxLength: 16,

	// The minimum and maximum username length
	nameMinLength: 5,
	nameMaxLength: 20
}
