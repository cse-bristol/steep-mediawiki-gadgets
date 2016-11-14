<?php

class SteepNavButtons {
    static function OnSkinBuildSidebar(Skin $skin, &$bar) {
        $nav = array();

        $bar['navigation'][] = array(
            'id' => 'new-process-model',
            'href' => '/process-model',
            'class' => 'new-process-model',
            'text' => wfMsg('new-process-model')
        );

        $bar['navigation'][] = array(
            'id' => 'new-map',
            'href' => '/map',
            'class' => 'new-map',
            'text' => wfMsg('new-map')
        );

        return true;
    }
}

?>