"use strict"

// This should be a service (.service)
// A service to contain the state settings of the contact manager
angular.module( 'contactListApp' )
	.factory( 'contactMangerStateService', [ function() {
		var state = {
			// To Do: GET the contact list here add it to the state object
			// Will need to modify the controller and all templates for this

			changeSort: function( field, bToggleDesc ) {
				// Make sure we have a field.  This method is called when we change the sort
				// order which may not pass a field
				if( ! field || field.length === 0 ) 
					field = this.order_by_field;

				// Set the order_by_field to field 
				this.order_by_field = field;

				// Set each of the other order by fields to desc
				for( var n in this.all_order_bys ) {
					this.all_order_bys[n].active = false;
				}

				// Update the appropiate section of all order by fields
				this.all_order_bys[field].active = true;

				if( bToggleDesc ) {
					this.all_order_bys[field].desc = ! this.all_order_bys[field].desc;
					this.order_by_desc = this.all_order_bys[field].desc;
				}
			},

			// The currently active orderby field
			order_by_field: 'firstname',

			// The currently active order (asc = false, desc = true)
			order_by_desc: false,

			// The possible order by fields and flags to keep track of each one is active
			// and it's order (asc, desc)
			all_order_bys: {
				firstname: {
					active: true,
					desc: false
				},
				lastname: {
					active: false,
					desc: false
				},
				email: {
					active: false,
					desc: false
				}
			},

			templates: [
				{ name: 'list', url: 'templates/contacts_list.html' },
				{ name: 'table', url: 'templates/contacts_table.html' }
			],

			// The currently selected template.  The initialization refers back to
			// the templates variable, so we have to do it outside of the object
			// declaration
			template: null,

			// The text used to filter the contact results
			filter_text: '',

			// An object that will keep track of the available actions and which one is selected 
			// for the table view to use
			actions: {
				selectableActions: [
					{ value: 'delete', name: 'Delete' },
					{ value: 'edit', name: 'Edit' } ],
				selected: ''
			}
		};

		state.template = state.templates[0];

		return state;
	}
] );