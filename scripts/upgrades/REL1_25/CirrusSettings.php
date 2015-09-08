<?php
wfLoadExtension('Elastica');
require_once "$IP/extensions/CirrusSearch/CirrusSearch.php";
$wgCirrusSearchServers = array('localhost');
$wgSearchType = 'CirrusSearch';
?>
