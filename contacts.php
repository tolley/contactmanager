<?PHP

$contacts = array(

	0 => array(
		'firstname' => 'chris',
		'lastname' => 'tolley',
		'phone'	=> '7031231234',
		'street' => '123 Main St',
		'street2' => 'apt 1B',
		'city' => 'pleasantville',
		'state' => 'va',
		'zip' => '20165',
	),
	1 => array(
		'firstname' => 'jim',
		'lastname' => 'smith',
		'phone'	=> '7033214321',
		'street' => '123 street dr',
		'street2' => '',
		'city' => 'cityville',
		'state' => 'va',
		'zip' => '20164',
	),
	2 => array(
		'firstname' => 'jane',
		'lastname' => 'doe',
		'phone'	=> '7033453443',
		'street' => 'circle dr',
		'street2' => '',
		'city' => 'squareville',
		'state' => 'ca',
		'zip' => '90210',
	)

);

header( 'Content-Type: application/json' );
echo json_encode( $contacts );

?>