<?php
/*
   Settings which prevent anonymous editing of and sign up to the wiki.
 */
$wgGroupPermissions['*']['createaccount'] = false;
$wgGroupPermissions['*']['edit'] = false;
$wgEmailConfirmToEdit = true;
require_once "$IP/extensions/ConfirmAccount/ConfirmAccount.php";
?>
