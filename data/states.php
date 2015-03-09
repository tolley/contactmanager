<?PHP

// Create a list of all US states
$states = array();

$states[] = array( 'value' => 'AL', 'name' => 'Alabama' );
$states[] = array( 'value' => 'AK', 'name' => 'Alaska' );
$states[] = array( 'value' => 'AZ', 'name' => 'Arizona' );
$states[] = array( 'value' => 'AR', 'name' => 'Arkansas' );
$states[] = array( 'value' => 'CA', 'name' => 'California' );
$states[] = array( 'value' => 'CO', 'name' => 'Colorado' );
$states[] = array( 'value' => 'CT', 'name' => 'Connecticut' );
$states[] = array( 'value' => 'DE', 'name' => 'Delaware' );
$states[] = array( 'value' => 'DC', 'name' => 'District of Columbia' );
$states[] = array( 'value' => 'FL', 'name' => 'Florida' );
$states[] = array( 'value' => 'GA', 'name' => 'Georgia' );
$states[] = array( 'value' => 'HI', 'name' => 'Hawaii' );
$states[] = array( 'value' => 'ID', 'name' => 'Idaho' );
$states[] = array( 'value' => 'IL', 'name' => 'Illinois' );
$states[] = array( 'value' => 'IN', 'name' => 'Indiana' );
$states[] = array( 'value' => 'IA', 'name' => 'Iowa' );
$states[] = array( 'value' => 'KS', 'name' => 'Kansas' );
$states[] = array( 'value' => 'KY', 'name' => 'Kentucky' );
$states[] = array( 'value' => 'LA', 'name' => 'Louisiana' );
$states[] = array( 'value' => 'ME', 'name' => 'Maine' );
$states[] = array( 'value' => 'MD', 'name' => 'Maryland' );
$states[] = array( 'value' => 'MA', 'name' => 'Massachusetts' );
$states[] = array( 'value' => 'MI', 'name' => 'Michigan' );
$states[] = array( 'value' => 'MN', 'name' => 'Minnesota' );
$states[] = array( 'value' => 'MS', 'name' => 'Mississippi' );
$states[] = array( 'value' => 'MO', 'name' => 'Missouri' );
$states[] = array( 'value' => 'MT', 'name' => 'Montana' );
$states[] = array( 'value' => 'NE', 'name' => 'Nebraska' );
$states[] = array( 'value' => 'NV', 'name' => 'Nevada' );
$states[] = array( 'value' => 'NH', 'name' => 'New Hampshire' );
$states[] = array( 'value' => 'NJ', 'name' => 'New Jersey' );
$states[] = array( 'value' => 'NM', 'name' => 'New Mexico' );
$states[] = array( 'value' => 'NY', 'name' => 'New York' );
$states[] = array( 'value' => 'NC', 'name' => 'North Carolina' );
$states[] = array( 'value' => 'ND', 'name' => 'North Dakota' );
$states[] = array( 'value' => 'OH', 'name' => 'Ohio' );
$states[] = array( 'value' => 'OK', 'name' => 'Oklahoma' );
$states[] = array( 'value' => 'OR', 'name' => 'Oregon' );
$states[] = array( 'value' => 'PA', 'name' => 'Pennsylvania' );
$states[] = array( 'value' => 'PR', 'name' => 'Puerto Rico' );
$states[] = array( 'value' => 'RI', 'name' => 'Rhode Island' );
$states[] = array( 'value' => 'SC', 'name' => 'South Carolina' );
$states[] = array( 'value' => 'SD', 'name' => 'South Dakota' );
$states[] = array( 'value' => 'TN', 'name' => 'Tennessee' );
$states[] = array( 'value' => 'TX', 'name' => 'Texas' );
$states[] = array( 'value' => 'UT', 'name' => 'Utah' );
$states[] = array( 'value' => 'VT', 'name' => 'Vermont' );
$states[] = array( 'value' => 'VI', 'name' => 'Virgin Islands' );
$states[] = array( 'value' => 'VA', 'name' => 'Virginia' );
$states[] = array( 'value' => 'WA', 'name' => 'Washington' );
$states[] = array( 'value' => 'WV', 'name' => 'West Virginia' );
$states[] = array( 'value' => 'WI', 'name' => 'Wisconsin' );
$states[] = array( 'value' => 'WY', 'name' => 'Wyoming' );


// Encode the state list as JSON and send it to the browser
header( 'Content-type: application/json' );

echo json_encode( $states );

?>