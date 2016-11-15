<?php

class ProjectsNavigation {
	static function OnSkinBuildSidebar(Skin $skin, &$bar) {
        array_unshift(
            $bar['navigation'],
            array(
                'id' => 'all-projects',
                'class' => 'all-projects',
                'href' => Skin::makeNSUrl(
                    wfMessage('all-projects-page')->text(),
                    '',
                    NS_CATEGORY
                ),
                'text' => wfMessage('all-projects')->text()
            )
        );
        
        return true;
    }
}

?>
