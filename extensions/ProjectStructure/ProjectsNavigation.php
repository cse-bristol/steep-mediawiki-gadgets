<?php

class ProjectsNavigation {
	static function OnSkinBuildSidebar(Skin $skin, &$bar) {
        array_unshift(
            $bar['navigation'],
            array(
                'id' => 'all-projects',
                'class' => 'all-projects',
                'href' => Skin::makeNSUrl(
                    wfMsg('all-projects-page'),
                    '',
                    NS_CATEGORY
                ),
                'text' => wfMsg('all-projects')
            )
        );
        
        return true;
    }
}

?>
