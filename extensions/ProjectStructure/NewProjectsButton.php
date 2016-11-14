<?php

class NewProjectsButton {
	static function OnCategoryTableAddToCategory(&$buttonConfig, $output, $categoryName) {
        ## Add the Javascript module.
		$output->addModules(array(
            'ext.project-structure'
        ));
        
        $allProjectsPage = Title::newFromText(
            wfMsg("all-projects-page"),
            NS_CATEGORY
        )->getFullText();

        if ($categoryName == $allProjectsPage) {

            ## Change the text
            $buttonConfig["label"] = wfMsg('new-project');
        }
        
        return true;
    }
}

?>
