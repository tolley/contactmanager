// Get our required objects
var mongoose = require( 'mongoose' );

// Create the individual contact's schema
var contactSchema = new mongoose.Schema( {
	firstname: { type: String, required: true },
	lastname: String,
	email: String,
	phone: String,
	street: String,
	street2: String,
	city: String,
	state: String,
	zip: String
} );

// Create our list contact schema
var contactListSchema = new mongoose.Schema( {
	ownerId: mongoose.Schema.ObjectId
	,contacts: [contactSchema] 
} );

// Export our model
module.exports = {
	contactModel: mongoose.model( 'Contact', contactSchema ),
	contactListModel: mongoose.model( 'ContactList', contactListSchema )
};
