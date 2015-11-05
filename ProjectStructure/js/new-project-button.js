"use strict";

/*global OO, mw*/

(function(OO, mw) {
    var projectsPage = mw.msg('all-projects-page'),
	allProjectsPage = mw.msg('all-projects-and-subprojects-page');

    mw.hook('wikipage.content').add(function(content) {
	
	var category = mw.config.values.wgTitle || "",
	    isProjectsPage = category === projectsPage,
	    isAProject = mw.config.values.wgCategories.indexOf(allProjectsPage) >= 0;

	if (isProjectsPage) {
	    OO.addToCategory.dialogueConstructor = OO.NewProjectDialogue;

	} else if (isAProject) {
	    OO.addToCategory.dialogueConstructor = OO.AddAssetToProjectDialogue;
	    
	} else {
	    // Noop: leave it as the default.
	}
    });
    
}(OO, mw));

