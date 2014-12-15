<?php

$wgResourceModules['ext.steep-mediawiki-gadgets'] = array(
    'scripts' => array( 'js/insert-process-model.js'),
    'messages' => array('visualeditor-mwprocessmodel-title'),
    'dependencies' => array('ext.visualEditor.core'),
    'localBasePath' => __DIR__,
    'remoteExtPath' => 'steep-mediawiki-gadgets'
);

array_push($wgVisualEditorPluginModules, 'ext.steep-mediawiki-gadgets');

?>  