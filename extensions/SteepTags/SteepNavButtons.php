<?php

class SteepNavButtons {
    static function OnSkinBuildSidebar(Skin $skin, &$bar) {
        $nav = array();

        $bar['navigation'][] = array(
            'id' => 'new-process-model',
            'href' => '/process-model',
            'class' => 'new-process-model',
            'text' => wfMessage('new-process-model')->text()
        );

        $bar['navigation'][] = array(
            'id' => 'new-map',
            'href' => '/map',
            'class' => 'new-map',
            'text' => wfMessage('new-map')->text()
        );

        return true;
    }
}

?>
