<?PHP

$contacts = array();

$contacts[] = array(
	'id' => 1,
	'firstname' => 'chris',
	'lastname' => 'tolley',
	'phone'	=> '7031231234',
	'email' => 'tolleycr@tolley.com',
	'street' => '123 Main St',
	'street2' => 'apt 1B',
	'city' => 'pleasantville',
	'state' => 'va',
	'zip' => '20165',
);

$contacts[] = array(
	'id' => 2,
	'firstname' => 'jim',
	'lastname' => 'smith',
	'phone'	=> '7033214321',
	'email' => 'smithj@tolley.com',
	'street' => '123 street dr',
	'street2' => '',
	'city' => 'cityville',
	'state' => 'va',
	'zip' => '20164',
);

$contacts[] = array(
	'id' => 3,
	'firstname' => 'jane',
	'lastname' => 'doe',
	'phone'	=> '7033453443',
	'email' => 'janed@tolley.com',
	'street' => 'circle dr',
	'street2' => '',
	'city' => 'squareville',
	'state' => 'ca',
	'zip' => '90210',
);

$contacts[] = array(
	'id' => 4,
	'firstname' => 'bear',
	'lastname' => 'tolley',
	'phone'	=> '4348675309',
	'email' => 'tolleyb@tolley.com',
	'street' => 'circle dr',
	'street2' => '',
	'city' => 'bedford',
	'state' => 'va',
	'zip' => '24552',
);

$contacts[] = array(
	'id' => 5,
	'firstname' => 'michael',
	'lastname' => 'bluth',
	'phone'	=> '9011231234',
	'email' => 'bluthm@tolley.com',
	'street' => '1 hilltop dr',
	'street2' => '',
	'city' => 'sunnydale',
	'state' => 'ca',
	'zip' => '90210',
);

$contacts[] = array(
	'id' => 6,
	'firstname' => 'lindsay',
	'lastname' => 'bluth',
	'phone'	=> '7032525533',
	'email' => 'lindsayb@tolley.com',
	'street' => '1 hilltop dr.',
	'street2' => '',
	'city' => 'sunnydale',
	'state' => 'ca',
	'zip' => '90210',
);

$contacts[] = array(
	'id' => 7,
	'firstname' => 'abed',
	'lastname' => 'nadir',
	'phone'	=> '4012525533',
	'email' => 'abedn@tolley.com',
	'street' => '123 dream ave',
	'street2' => '',
	'city' => 'greendale',
	'state' => 'ca',
	'zip' => '90210',
);

header( 'Content-Type: application/json' );
echo json_encode( $contacts );

?>