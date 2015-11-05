<?php

if ($wgLogo === "/wiki/resources/assets/wiki.png" || !$wgLogo) {
  $wgLogo = "/mediawiki/extensions/steep-mediawiki-gadgets/steep-logo.png";
}

$wgEmergencyContact = "wiki@smartsteep.eu";
$wgPasswordSender = "wiki@smartsteep.eu";

$wgEnotifUserTalk = true; # UPO
$wgEnotifWatchlist = true; # UPO

$wgMainCacheType = CACHE_ACCEL;

$wgEnableUploads = true;

# InstantCommons allows wiki to use images from http://commons.wikimedia.org
$wgUseInstantCommons = true;

enableSemantics('smartsteep.eu');

require_once "$IP/extensions/Cite/Cite.php";
require_once "$IP/extensions/Gadgets/Gadgets.php";
require_once "$IP/extensions/Interwiki/Interwiki.php";
require_once "$IP/extensions/WikiEditor/WikiEditor.php";
require_once "$IP/extensions/VisualEditor/VisualEditor.php";
require_once "$IP/extensions/LiquidThreads/LiquidThreads.php";
require_once "$IP/extensions/SemanticForms/SemanticForms.php";
require_once "$IP/extensions/SemanticFormsInputs/SemanticFormsInputs.php";
require_once "$IP/extensions/SemanticDrilldown/SemanticDrilldown.php";
require_once "$IP/extensions/InputBox/InputBox.php";
require_once "$IP/extensions/GraphViz/GraphViz.php";
require_once "$IP/extensions/MwEmbedSupport/MwEmbedSupport.php";
require_once "$IP/extensions/TimedMediaHandler/TimedMediaHandler.php";
require_once "$IP/extensions/R/R.php";
// require_once('extensions/IntraACL/includes/HACL_Initialize.php');
// enableIntraACL();

wfLoadExtensions(array(
    'SteepIcons',
    'SteepTags',
    'CategoryTables',
    'ProjectStructure'    
));

## Stuff to configure the URL rewriting stuff
$wgArticlePath = "/wiki/$1";
$wgUsePathInfo = true;

# wire up parsoid to this wiki
$wgVisualEditorParsoidURL = 'http://localhost:8000';
$wgVisualEditorParsoidForwardCookies = true;
$wgDefaultUserOptions['visualeditor-enable'] = 1;

$smwgShowFactbox=SMW_FACTBOX_NONEMPTY;

# enable process graph output
$srfgFormats[] = 'process';

# Enables use of WikiEditor by default but still allow users to disable it in preferences
$wgDefaultUserOptions['usebetatoolbar'] = 1;
$wgDefaultUserOptions['usebetatoolbar-cgd'] = 1;
 
# Displays the Preview and Changes tabs
$wgDefaultUserOptions['wikieditor-preview'] = 1;
 
$wgAllowUserJs=true;

$wgFileExtensions = array('png', 'gif', 'jpg', 'jpeg', 'doc', 'xls', 'mpp', 'pdf', 'ppt', 'tiff', 'bmp', 'docx', 'xlsx', 'pptx', 'ps', 'psd', 'swf', 'fla', 'mp3', 'mp4', 'm4v', 'mov', 'avi');

$wgUploadSizeWarning = 2147483648;
$wgMaxUploadSize = 2147483648;

# Minimalist request account form.
$wgMakeUserPageFromBio = false;
$wgAutoWelcomeNewUsers = false;

$wgNamespacesWithSubpages[NS_MAIN] = true;
$wgVisualEditorSupportedSkins[] = 'steep';
$wgDefaultSkin = "steep";

# Enabled skins.
# The following skins were automatically enabled:
wfLoadSkins(array(
    'Steep',
    'Vector'
));

$wgVisualEditorNamespaces = array_merge(
  $wgContentNamespaces,
  array(
    NS_USER,
    NS_CATEGORY,
    NS_FILE
  )
);
