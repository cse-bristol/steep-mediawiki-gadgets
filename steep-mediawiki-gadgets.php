<?php

$wgMessagesDirs['ViewFiles'] = __DIR__ . '/i18n';

$wgResourceModules['ext.steep-mediawiki-gadgets'] = array(
  'scripts' => array(
    'js/VersionPicker.js',
    'js/ve.dm.SteepNode.js',
    'js/ve.ce.SteepNode.js',
    'js/ve.dm.ProcessModelNode.js',
    'js/ve.ce.ProcessModelNode.js',
    'js/ve.dm.MapNode.js',
    'js/ve.ce.MapNode.js',        
    'js/steep-dialogue-and-tool.js'
  ),
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

$wgAutoloadClasses['IncludeSteepGadgets'] = __DIR__ . '/IncludeSteepGadgets.php';

$wgHooks['ParserFirstCallInit'][] = 'IncludeSteepGadgets::HookParser';

array_push($wgVisualEditorPluginModules, 'ext.steep-mediawiki-gadgets');

?>  