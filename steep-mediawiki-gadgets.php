<?php

$wgMessagesDirs['ViewFiles'] = __DIR__ . '/i18n';

$wgResourceModules['ext.steep-mediawiki-gadgets'] = array(
    'scripts' => array( 'js/insert-process-model.js'),
    'messages' => array(
        'visualeditor-mwprocessmodel-button',
        'visualeditor-mwprocessmodel-dialogue',
        'visualeditor-mwmap-button',
        'visualeditor-mwmap-dialogue'
    ),
    'dependencies' => array(
        'ext.visualEditor.core',
        'mediawiki.jqueryMsg'
    ),
    'localBasePath' => __DIR__,
    'remoteExtPath' => 'steep-mediawiki-gadgets'
);

$wgExtensionCredits['steep-mediawiki-gadgets'][] = array(
    'path' => __FILE__,
    'name' => 'Steep Extensions',
    'author' => 'Glenn Searby', 
    'url' => 'https://github.com/cse-bristol/steep-mediawiki-gadgets', 
    'description' => 'This extension adds the ability to include Process Models and Energy Efficiency Maps in a wiki page.',
    'version'  => 0.1,
    'license-name' => "MIT",
);

$wgShowExceptionDetails = true;

$wgAutoloadClasses['IncludeSteepGadgets'] = __DIR__ . '/IncludeSteepGadgets.php';

$wgHooks['ParserFirstCallInit'][] = 'IncludeSteepGadgets::HookParser';

array_push($wgVisualEditorPluginModules, 'ext.steep-mediawiki-gadgets');

?>  