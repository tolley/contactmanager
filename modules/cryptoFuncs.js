// Contains a few functions to make working with the crypto
// libraries easier and more abstract
var config = require( '../config' ),
	crypto = require( 'crypto' );

module.exports = {
	encrypt: function( value ) {
		var cipher = crypto.createCipher( config.crypto.algorithm,
											config.crypto.key );
		var crypted = cipher.update( value, 'utf8', 'hex' );
		crypted += cipher.final( 'hex' );
		return crypted;
	},

	decrypt: function( value ) {
		var decipher = crypto.createDecipher( config.crypto.algorithm,
												config.crypto.key );
		var dec = decipher.update( value, 'hex', 'utf8' );
		dec += decipher.final( 'utf8' );
		return dec;
	}
}