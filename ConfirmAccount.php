$wgGroupPermissions['*']['createaccount'] = false;
$wgGroupPermissions['*']['edit'] = false;
$wgEmailConfirmToEdit = true;

$wgConfirmAccountRequestFormItems = array(
'UserName'        => array( 'enabled' => true ),
'RealName'        => array( 'enabled' => true ),
'Biography'       => array( 'enabled' => false, 'minWords' => 0 ),
'AreasOfInterest' => array( 'enabled' => false ),
'CV'              => array( 'enabled' => false ),
'Notes'           => array( 'enabled' => true ),
'Links'           => array( 'enabled' => false ),
'TermsOfService'  => array( 'enabled' => true ),
);

require_once "$IP/extensions/ConfirmAccount/ConfirmAccount.php";
