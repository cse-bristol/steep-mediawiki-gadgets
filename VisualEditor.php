wfLoadExtensions(array('VisualEditor'));
$wgVisualEditorSupportedSkins[] = 'steep';
$wgDefaultUserOptions['visualeditor-enable'] = 1;

# wire up parsoid to this wiki
$wgVisualEditorParsoidURL = 'http://localhost:8000';
$wgVisualEditorParsoidForwardCookies = true;

$wgVisualEditorNamespaces = array_merge(
    $wgContentNamespaces,
    array(
        NS_USER,
        NS_CATEGORY,
        NS_FILE
    )
);