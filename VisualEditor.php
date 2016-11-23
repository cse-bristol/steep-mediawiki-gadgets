wfLoadExtensions(array('VisualEditor'));
$wgVisualEditorSupportedSkins[] = 'steep';
$wgDefaultUserOptions['visualeditor-enable'] = 1;

# wire up parsoid to this wiki
$wgVirtualRestConfig['modules']['parsoid'] = array(
    'url' => 'http://127.0.0.1:8000'
);

## See: https://www.mediawiki.org/wiki/Extension:VisualEditor#Forwarding_Cookies_to_Parsoid
## $wgVisualEditorParsoidForwardCookies = true;

$wgVisualEditorAvailableNamespaces = array(
    NS_MAIN => true,
    NS_HELP => true,
    NS_PROJECT => true,
    NS_USER => true,
    NS_CATEGORY => true,
    NS_FILE => true
);
