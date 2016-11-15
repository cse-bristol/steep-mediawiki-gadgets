<?php

class NewProjectsButton {
	static function OnCategoryTableAddToCategory(&$buttonConfig, $output, $categoryName) {
        ## Add the Javascript module.
		$output->addModules(array(
            'ext.project-structure'
        ));
        
        $allProjectsPage = Title::newFromText(
            wfMessage("all-projects-page")->text(),
            NS_CATEGORY
        )->getFullText();

        if ($categoryName == $allProjectsPage) {

            ## Change the text
            $buttonConfig["label"] = wfMessage('new-project')->text();
        }
        
        return true;
    }
}

?>
